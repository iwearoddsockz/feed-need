"use client";

import dynamic from "next/dynamic";
import type { MealLocation } from "@/types/location";
import { Loader2 } from "lucide-react";

const MapView = dynamic(
  () => import("./MapView").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading map</span>
      </div>
    ),
  }
);

interface DynamicMapProps {
  locations: MealLocation[];
  userLocation: { latitude: number; longitude: number } | null;
}

export function DynamicMap({ locations, userLocation }: DynamicMapProps) {
  return <MapView locations={locations} userLocation={userLocation} />;
}
