"use client";

import { LocateFixed, Loader2, AlertCircle } from "lucide-react";
import { useLocations } from "@/lib/hooks/useLocations";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { DynamicMap } from "@/components/map/DynamicMap";
import { MapLegend } from "@/components/map/MapLegend";

export default function MapPage() {
  const { locations, loading, error } = useLocations();
  const {
    latitude,
    longitude,
    loading: locating,
    error: geoError,
    requestLocation,
  } = useGeolocation();

  const userLocation =
    latitude !== null && longitude !== null ? { latitude, longitude } : null;

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading locations</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex items-center gap-2 text-destructive" role="alert">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
          <p>Could not load locations. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1">
      <DynamicMap locations={locations} userLocation={userLocation} />

      <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={requestLocation}
          disabled={locating}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-md transition-colors hover:bg-accent disabled:opacity-50"
          aria-label="Find my location"
          title={geoError ?? "Find my location"}
        >
          {locating ? (
            <Loader2
              className="h-5 w-5 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <LocateFixed className="h-5 w-5 text-foreground" aria-hidden="true" />
          )}
        </button>
      </div>

      <MapLegend />
    </div>
  );
}
