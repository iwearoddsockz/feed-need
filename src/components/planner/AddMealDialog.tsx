"use client";

import { useState, useMemo } from "react";
import { Search, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocations } from "@/lib/hooks/useLocations";
import { usePlannerStore } from "@/lib/stores/planner";
import { formatDay } from "@/lib/utils/date";
import type { MealSlotType } from "@/types/planner";
import type { DayOfWeek, MealLocation } from "@/types/location";

interface AddMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: DayOfWeek;
  slot: MealSlotType;
}

function getScheduleWarning(
  location: MealLocation,
  day: DayOfWeek,
  slot: MealSlotType
): string | null {
  const daySchedules = location.operating_schedules.filter(
    (s) => s.day === day && s.is_active
  );

  if (daySchedules.length === 0) {
    return `This location doesn't operate on ${formatDay(day)}`;
  }

  const slotSchedules = daySchedules.filter((s) => s.meal_type === slot);
  if (slotSchedules.length === 0) {
    return `This location doesn't serve ${slot} on ${formatDay(day)}`;
  }

  return null;
}

function getBestSchedule(
  location: MealLocation,
  day: DayOfWeek,
  slot: MealSlotType
) {
  const exact = location.operating_schedules.find(
    (s) => s.day === day && s.meal_type === slot && s.is_active
  );
  if (exact) return { start_time: exact.start_time, end_time: exact.end_time };

  const dayMatch = location.operating_schedules.find(
    (s) => s.day === day && s.is_active
  );
  if (dayMatch)
    return { start_time: dayMatch.start_time, end_time: dayMatch.end_time };

  const slotMatch = location.operating_schedules.find(
    (s) => s.meal_type === slot && s.is_active
  );
  if (slotMatch)
    return { start_time: slotMatch.start_time, end_time: slotMatch.end_time };

  const defaults: Record<
    MealSlotType,
    { start_time: string; end_time: string }
  > = {
    breakfast: { start_time: "07:00", end_time: "09:00" },
    lunch: { start_time: "11:30", end_time: "13:30" },
    dinner: { start_time: "17:00", end_time: "19:00" },
  };
  return defaults[slot];
}

export function AddMealDialog({
  open,
  onOpenChange,
  day,
  slot,
}: AddMealDialogProps) {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<MealLocation | null>(null);
  const { locations, loading } = useLocations();
  const addEntry = usePlannerStore((s) => s.addEntry);

  const filtered = useMemo(() => {
    if (!search) return locations;
    const q = search.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.suburb.toLowerCase().includes(q) ||
        (loc.organisation && loc.organisation.toLowerCase().includes(q))
    );
  }, [locations, search]);

  const warning = selectedLocation
    ? getScheduleWarning(selectedLocation, day, slot)
    : null;

  function handleAdd() {
    if (!selectedLocation) return;

    const schedule = getBestSchedule(selectedLocation, day, slot);
    addEntry({
      day,
      slot,
      location_id: selectedLocation.id,
      location_name: selectedLocation.name,
      location_address: selectedLocation.street_address,
      location_suburb: selectedLocation.suburb,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      notes,
    });
    handleClose();
  }

  function handleClose() {
    setSearch("");
    setNotes("");
    setSelectedLocation(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Add {slot} &ndash; {formatDay(day)}
          </DialogTitle>
          <DialogDescription>
            Choose a location for this meal
          </DialogDescription>
        </DialogHeader>

        {selectedLocation ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border bg-accent/30 p-3">
              <p className="font-medium">{selectedLocation.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedLocation.street_address}, {selectedLocation.suburb}
              </p>
            </div>

            {warning && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-yellow-500/50 bg-yellow-50 p-3 text-sm dark:bg-yellow-950/20"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" aria-hidden="true" />
                <p>{warning}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="meal-notes"
                className="mb-1 block text-sm font-medium"
              >
                Notes (optional)
              </label>
              <input
                id="meal-notes"
                type="text"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Bring container, arrive early..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedLocation(null)}
              >
                Back
              </Button>
              <Button className="flex-1" onClick={handleAdd}>
                Add to plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Search locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search locations"
              />
            </div>

            <div
              className="-mx-6 flex-1 overflow-y-auto px-6"
              style={{ maxHeight: "50vh" }}
            >
              {loading ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Loading locations...
                </p>
              ) : filtered.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No locations found
                </p>
              ) : (
                <ul role="list" className="space-y-1">
                  {filtered.map((loc) => {
                    const conflict = getScheduleWarning(loc, day, slot);
                    return (
                      <li key={loc.id} role="listitem">
                        <button
                          className="w-full rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent"
                          onClick={() => setSelectedLocation(loc)}
                        >
                          <span className="font-medium">{loc.name}</span>
                          <span className="ml-1 text-muted-foreground">
                            &ndash; {loc.suburb}
                          </span>
                          {conflict && (
                            <AlertTriangle
                              className="ml-1 inline-block h-3 w-3 text-yellow-500"
                              aria-hidden="true"
                            />
                          )}
                          {conflict && (
                            <span className="sr-only">
                              (schedule warning)
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
