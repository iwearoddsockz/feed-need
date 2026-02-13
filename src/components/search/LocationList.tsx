"use client";

import { Loader2 } from "lucide-react";
import type { MealLocation } from "@/types/location";
import { LocationCard } from "@/components/location/LocationCard";

interface LocationListProps {
  locations: MealLocation[];
  loading: boolean;
  error: string | null;
}

export function LocationList({ locations, loading, error }: LocationListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading locations</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center" role="alert">
        <p className="text-destructive">
          Could not load locations. Please try again later.
        </p>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No locations found. Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        {locations.length} {locations.length === 1 ? "location" : "locations"}{" "}
        found
      </p>
      <div className="space-y-3" role="list">
        {locations.map((location) => (
          <div key={location.id} role="listitem">
            <LocationCard location={location} />
          </div>
        ))}
      </div>
    </div>
  );
}
