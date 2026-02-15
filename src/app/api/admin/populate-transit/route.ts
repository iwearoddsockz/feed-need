import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { NearbyBusStop, NearbyTrainStation, NearbyTransit } from "@/types/location";

const OVERPASS_API = "https://overpass-api.de/api/interpreter";
const BUS_RADIUS_M = 500;
const TRAIN_RADIUS_M = 1500;
const MAX_BUS_STOPS = 3;
const WALK_SPEED_KMH = 5;

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function walkMin(distanceM: number): number {
  return Math.round((distanceM / 1000 / WALK_SPEED_KMH) * 60);
}

async function queryOverpass(query: string): Promise<{ elements: OverpassNode[] }> {
  const res = await fetch(OVERPASS_API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) {
    throw new Error(`Overpass API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

interface OverpassNode {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

async function getBusStops(lat: number, lng: number): Promise<NearbyBusStop[]> {
  const query = `[out:json][timeout:10];node["highway"="bus_stop"](around:${BUS_RADIUS_M},${lat},${lng});out body;`;
  const data = await queryOverpass(query);

  const stops: NearbyBusStop[] = data.elements
    .filter((el) => el.type === "node")
    .map((el) => {
      const distM = Math.round(haversineM(lat, lng, el.lat, el.lon));
      const stopId = el.tags?.ref || el.tags?.["ref:stop"] || String(el.id);
      const name = el.tags?.name || `Stop ${stopId}`;
      const routeRef = el.tags?.route_ref || el.tags?.["route_ref:bus"] || "";
      const routes = routeRef
        ? routeRef.split(/[;,]/).map((r: string) => r.trim()).filter(Boolean)
        : [];

      return {
        name,
        stop_id: stopId,
        lat: el.lat,
        lng: el.lon,
        distance_m: distM,
        walk_min: walkMin(distM),
        routes,
      };
    })
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, MAX_BUS_STOPS);

  return stops;
}

async function getTrainStations(lat: number, lng: number): Promise<NearbyTrainStation[]> {
  const query = `[out:json][timeout:10];node["railway"="station"](around:${TRAIN_RADIUS_M},${lat},${lng});out body;`;
  const data = await queryOverpass(query);

  const stations: NearbyTrainStation[] = data.elements
    .filter((el) => el.type === "node" && el.tags?.name)
    .map((el) => {
      const distM = Math.round(haversineM(lat, lng, el.lat, el.lon));
      return {
        name: el.tags!.name,
        lat: el.lat,
        lng: el.lon,
        distance_m: distM,
        walk_min: walkMin(distM),
      };
    })
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, 1); // Keep only the nearest station

  return stations;
}

interface LocationRow {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  // Simple secret-based auth
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error: fetchError } = await (supabase
    .from("locations")
    .select("id, name, latitude, longitude, nearby_transit")
    .eq("is_active", true)
    .order("name") as any);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const allLocations = (data ?? []) as (LocationRow & { nearby_transit: NearbyTransit | null })[];

  // Only process locations with empty transit data (retry-safe)
  const retryOnly = request.nextUrl.searchParams.get("retry") === "true";
  const locations = retryOnly
    ? allLocations.filter((loc) => {
        const t = loc.nearby_transit;
        return !t || (t.bus_stops.length === 0 && t.train_stations.length === 0);
      })
    : allLocations;

  const results: { name: string; bus_stops: number; train_stations: number; error?: string }[] = [];

  for (const loc of locations) {
    try {
      // Sequential requests to avoid Overpass rate limiting
      const busStops = await getBusStops(loc.latitude, loc.longitude);
      await sleep(2000);
      const trainStations = await getTrainStations(loc.latitude, loc.longitude);

      const transit: NearbyTransit = {
        bus_stops: busStops,
        train_stations: trainStations,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from("locations")
        .update({ nearby_transit: transit })
        .eq("id", loc.id);

      if (updateError) {
        results.push({ name: loc.name, bus_stops: 0, train_stations: 0, error: updateError.message });
      } else {
        results.push({ name: loc.name, bus_stops: busStops.length, train_stations: trainStations.length });
      }
    } catch (err) {
      results.push({
        name: loc.name,
        bus_stops: 0,
        train_stations: 0,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }

    // Rate limit: 2 seconds between locations
    await sleep(2000);
  }

  return NextResponse.json({ success: true, results });
}
