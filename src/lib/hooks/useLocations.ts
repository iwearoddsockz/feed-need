"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cacheLocations, getCachedLocations } from "@/lib/cache/locations";
import { distanceKm } from "@/lib/utils/geo";
import type { MealLocation, DayOfWeek, MealType } from "@/types/location";

export type LocationWithDistance = MealLocation & { distance?: number };

export interface LocationFilters {
  suburb?: string;
  postcode?: string;
  day?: DayOfWeek;
  mealType?: MealType;
  centerLat?: number;
  centerLng?: number;
  radiusKm?: number;
}

function applyDistanceFilter(
  locations: MealLocation[],
  centerLat: number,
  centerLng: number,
  radiusKm?: number
): LocationWithDistance[] {
  const withDistance = locations.map((loc) => ({
    ...loc,
    distance: distanceKm(centerLat, centerLng, loc.latitude, loc.longitude),
  }));

  const filtered = radiusKm
    ? withDistance.filter((loc) => loc.distance <= radiusKm)
    : withDistance;

  return filtered.sort((a, b) => a.distance - b.distance);
}

function applyClientFilters(
  locations: MealLocation[],
  filters?: LocationFilters
): LocationWithDistance[] {
  let results: LocationWithDistance[] = locations;

  // Distance-based filtering (replaces suburb ilike when center is set)
  if (
    filters?.centerLat !== undefined &&
    filters?.centerLng !== undefined
  ) {
    results = applyDistanceFilter(
      results,
      filters.centerLat,
      filters.centerLng,
      filters.radiusKm
    );
  } else {
    if (filters?.suburb) {
      const s = filters.suburb.toLowerCase();
      results = results.filter((loc) =>
        loc.suburb.toLowerCase().includes(s)
      );
    }
    if (filters?.postcode) {
      results = results.filter((loc) => loc.postcode === filters.postcode);
    }
  }

  if (filters?.day || filters?.mealType) {
    results = results
      .map((loc) => ({
        ...loc,
        operating_schedules: loc.operating_schedules.filter((s) => {
          if (filters.day && s.day !== filters.day) return false;
          if (filters.mealType && s.meal_type !== filters.mealType)
            return false;
          return true;
        }),
      }))
      .filter((loc) => loc.operating_schedules.length > 0);
  }

  return results;
}

export function useLocations(filters?: LocationFilters) {
  const [locations, setLocations] = useState<LocationWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFromCache(false);

    try {
      const supabase = createClient();
      const useDistanceFilter =
        filters?.centerLat !== undefined && filters?.centerLng !== undefined;

      let query = supabase
        .from("locations")
        .select(
          `
          *,
          operating_schedules(*)
        `
        )
        .eq("is_active", true)
        .order("name");

      // Only apply server-side suburb/postcode filter when NOT using distance
      if (!useDistanceFilter) {
        if (filters?.suburb) {
          query = query.ilike("suburb", `%${filters.suburb}%`);
        }
        if (filters?.postcode) {
          query = query.eq("postcode", filters.postcode);
        }
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw new Error(queryError.message);
      }

      let results = (data ?? []) as MealLocation[];

      // Client-side filter by day/mealType since these are on the join
      if (filters?.day || filters?.mealType) {
        results = results
          .map((loc) => ({
            ...loc,
            operating_schedules: loc.operating_schedules.filter((s) => {
              if (filters.day && s.day !== filters.day) return false;
              if (filters.mealType && s.meal_type !== filters.mealType)
                return false;
              return true;
            }),
          }))
          .filter((loc) => loc.operating_schedules.length > 0);
      }

      // Apply distance filter + sort if center is set
      let finalResults: LocationWithDistance[];
      if (useDistanceFilter) {
        finalResults = applyDistanceFilter(
          results,
          filters.centerLat!,
          filters.centerLng!,
          filters.radiusKm
        );
      } else {
        finalResults = results;
      }

      setLocations(finalResults);

      // Cache the full unfiltered dataset to IndexedDB for offline use
      if (
        !filters?.suburb &&
        !filters?.postcode &&
        !filters?.day &&
        !filters?.mealType &&
        !useDistanceFilter
      ) {
        cacheLocations(results);
      }
    } catch (err) {
      // Try IndexedDB fallback when network/Supabase fails
      try {
        const cached = await getCachedLocations();
        if (cached.length > 0) {
          setLocations(applyClientFilters(cached, filters));
          setFromCache(true);
          return;
        }
      } catch {
        // IndexedDB also unavailable
      }

      setError(
        err instanceof Error ? err.message : "Failed to load locations"
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters?.suburb,
    filters?.postcode,
    filters?.day,
    filters?.mealType,
    filters?.centerLat,
    filters?.centerLng,
    filters?.radiusKm,
  ]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, loading, error, fromCache, refetch: fetchLocations };
}
