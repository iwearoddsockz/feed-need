import type { NearbyBusStop, NearbyTrainStation } from "@/types/location";

const WALK_SPEED_KMH = 5;

/** Estimate walking time in minutes from distance in metres */
export function walkMinutes(distanceM: number): number {
  return Math.round((distanceM / 1000 / WALK_SPEED_KMH) * 60);
}

/** Google Maps transit view for a bus stop (shows live departures) */
export function getStopTransitUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${lat},${lng},17z`;
}

/** Google Maps transit directions to a location */
export function getTransitDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=transit`;
}

/** Transperth journey planner URL */
export function getJourneyPlannerUrl(): string {
  return "https://www.transperth.wa.gov.au/Journey-Planner";
}

/** Google Maps walking directions to a lat/lng */
export function getWalkingDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

/** Format a bus stop for compact display: "Stop 12345 (150m)" */
export function formatBusStopCompact(stop: NearbyBusStop): string {
  return `Stop ${stop.stop_id} (${stop.distance_m}m)`;
}

/** Format a train station for compact display: "Perth Stn (500m)" */
export function formatTrainStationCompact(station: NearbyTrainStation): string {
  const shortName = station.name.replace(/ Station$/i, " Stn");
  return `${shortName} (${station.distance_m}m)`;
}
