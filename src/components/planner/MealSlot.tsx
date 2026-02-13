"use client";

import { useState, useMemo } from "react";
import { Plus, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlannerStore } from "@/lib/stores/planner";
import { formatTime } from "@/lib/utils/date";
import type { MealSlotType } from "@/types/planner";
import type { DayOfWeek } from "@/types/location";
import { AddMealDialog } from "./AddMealDialog";

interface MealSlotProps {
  day: DayOfWeek;
  slot: MealSlotType;
}

const SLOT_LABELS: Record<MealSlotType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export function MealSlot({ day, slot }: MealSlotProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const allEntries = usePlannerStore((s) => s.plan.entries);
  const entries = useMemo(
    () => allEntries.filter((e) => e.day === day && e.slot === slot),
    [allEntries, day, slot]
  );
  const removeEntry = usePlannerStore((s) => s.removeEntry);

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {SLOT_LABELS[slot]}
        </h3>
        <Button
          variant="ghost"
          size="icon-xs"
          className="-m-2 p-2"
          onClick={() => setDialogOpen(true)}
          aria-label={`Add ${slot} on ${day}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {entries.length === 0 ? (
        <button
          onClick={() => setDialogOpen(true)}
          className="flex w-full items-center justify-center rounded-md border border-dashed py-4 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
          aria-label={`Add ${slot} on ${day}`}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add meal
        </button>
      ) : (
        <ul className="space-y-2" role="list">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start justify-between rounded-md bg-accent/50 p-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{entry.location_name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  <MapPin className="mr-0.5 inline-block h-3 w-3" aria-hidden="true" />
                  {entry.location_suburb}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(entry.start_time)} –{" "}
                  {formatTime(entry.end_time)}
                </p>
                {entry.notes && (
                  <p className="mt-1 text-xs italic text-muted-foreground">
                    {entry.notes}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                className="-m-2 p-2"
                onClick={() => removeEntry(entry.id)}
                aria-label={`Remove ${entry.location_name}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <AddMealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        day={day}
        slot={slot}
      />
    </div>
  );
}
