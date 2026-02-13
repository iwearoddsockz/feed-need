"use client";

import { useMemo } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlannerStore } from "@/lib/stores/planner";
import { DAYS_OF_WEEK } from "@/lib/utils/constants";
import { formatDay } from "@/lib/utils/date";
import type { DayOfWeek } from "@/types/location";

export function PlannerSummary() {
  const entries = usePlannerStore((s) => s.plan.entries);
  const clearAll = usePlannerStore((s) => s.clearAll);

  const totalMeals = entries.length;

  const daysWithMeals = useMemo(() => {
    const days = new Set(entries.map((e) => e.day));
    return days.size;
  }, [entries]);

  const uniqueLocations = useMemo(() => {
    const ids = new Set(entries.map((e) => e.location_id));
    return ids.size;
  }, [entries]);

  function getDirectionsUrl(day: DayOfWeek): string | null {
    const dayEntries = entries
      .filter((e) => e.day === day)
      .sort((a, b) => {
        const order = { breakfast: 0, lunch: 1, dinner: 2 } as const;
        return order[a.slot] - order[b.slot];
      });

    if (dayEntries.length === 0) return null;

    const addresses = dayEntries.map(
      (e) => `${e.location_address}, ${e.location_suburb}, WA`
    );

    if (addresses.length === 1) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addresses[0])}`;
    }

    const origin = encodeURIComponent(addresses[0]);
    const destination = encodeURIComponent(addresses[addresses.length - 1]);
    const waypoints =
      addresses.length > 2
        ? `&waypoints=${addresses
            .slice(1, -1)
            .map(encodeURIComponent)
            .join("|")}`
        : "";

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}`;
  }

  if (totalMeals === 0) return null;

  return (
    <div className="rounded-lg border bg-accent/30 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Your week</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={clearAll}
          aria-label="Clear all planned meals"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Clear all
        </Button>
      </div>

      <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">{totalMeals}</strong>{" "}
          {totalMeals === 1 ? "meal" : "meals"}
        </span>
        <span>
          <strong className="text-foreground">{daysWithMeals}</strong>{" "}
          {daysWithMeals === 1 ? "day" : "days"}
        </span>
        <span>
          <strong className="text-foreground">{uniqueLocations}</strong>{" "}
          {uniqueLocations === 1 ? "location" : "locations"}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        {DAYS_OF_WEEK.map((day) => {
          const url = getDirectionsUrl(day);
          if (!url) return null;
          const count = entries.filter((e) => e.day === day).length;
          return (
            <a
              key={day}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              aria-label={`Get directions for ${formatDay(day)} (${count} ${count === 1 ? "meal" : "meals"}) - opens Google Maps`}
            >
              <span>
                {formatDay(day)}{" "}
                <span className="text-muted-foreground">
                  ({count} {count === 1 ? "meal" : "meals"})
                </span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
