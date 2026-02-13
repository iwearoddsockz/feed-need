"use client";

import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import type { MealLocation } from "@/types/location";
import { formatAddress, getDirectionsUrl, formatMealType } from "@/lib/utils/format";
import { formatTime } from "@/lib/utils/date";
import {
  getMarkerStatus,
  getTodaySchedules,
} from "@/lib/utils/location-status";

interface LocationCardProps {
  location: MealLocation;
}

export function LocationCard({ location }: LocationCardProps) {
  const status = getMarkerStatus(location);
  const todaySchedules = getTodaySchedules(location);

  return (
    <Link href={`/location/${location.id}`} className="block">
      <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-tight">
            {location.name}
          </h2>
          {location.organisation &&
            location.organisation !== location.name && (
              <p className="text-sm text-muted-foreground">
                {location.organisation}
              </p>
            )}
        </div>

        <div className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            {formatAddress(
              location.street_address,
              location.suburb,
              location.postcode
            )}
          </span>
        </div>

        <div className="mt-2">
          {status === "serving" && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-green-700">
              <span
                className="inline-block h-2 w-2 rounded-full bg-green-600"
                aria-hidden="true"
              />
              Serving now
              {todaySchedules.length > 0 && (
                <span className="font-normal text-muted-foreground">
                  &middot;{" "}
                  {todaySchedules
                    .map((s) => formatMealType(s.meal_type))
                    .join(", ")}
                </span>
              )}
            </div>
          )}
          {status === "today" && todaySchedules.length > 0 && (
            <div className="flex items-start gap-1.5 text-sm text-blue-700">
              <span
                className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-blue-600"
                aria-hidden="true"
              />
              <span>
                Today:{" "}
                {todaySchedules
                  .map(
                    (s) =>
                      `${formatMealType(s.meal_type)} ${formatTime(s.start_time)}\u2013${formatTime(s.end_time)}`
                  )
                  .join(", ")}
              </span>
            </div>
          )}
          {status === "closed" && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span
                className="inline-block h-2 w-2 rounded-full bg-gray-400"
                aria-hidden="true"
              />
              Not serving today
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center text-sm">
          {location.wheelchair_accessible && (
            <span className="text-muted-foreground">Wheelchair accessible</span>
          )}
          <a
            href={getDirectionsUrl(
              location.latitude,
              location.longitude,
              location.name
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 font-medium text-primary"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Get directions to ${location.name}`}
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            Directions
          </a>
        </div>
      </div>
    </Link>
  );
}
