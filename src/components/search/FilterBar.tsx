"use client";

import { X } from "lucide-react";
import type { DayOfWeek, MealType } from "@/types/location";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/lib/utils/constants";
import { formatDay } from "@/lib/utils/date";
import { formatMealType } from "@/lib/utils/format";

const RADIUS_OPTIONS = [
  { value: "", label: "Any distance" },
  { value: "2", label: "Within 2 km" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" },
  { value: "20", label: "Within 20 km" },
] as const;

interface FilterBarProps {
  day: DayOfWeek | undefined;
  mealType: MealType | undefined;
  openNow: boolean;
  radiusKm: number | undefined;
  showRadius: boolean;
  onDayChange: (day: DayOfWeek | undefined) => void;
  onMealTypeChange: (type: MealType | undefined) => void;
  onOpenNowChange: (open: boolean) => void;
  onRadiusChange: (radius: number | undefined) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  day,
  mealType,
  openNow,
  radiusKm,
  showRadius,
  onDayChange,
  onMealTypeChange,
  onOpenNowChange,
  onRadiusChange,
  onClearAll,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showRadius && (
        <select
          value={radiusKm?.toString() ?? ""}
          onChange={(e) =>
            onRadiusChange(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="rounded-lg border bg-background px-3 py-2 text-sm"
          aria-label="Filter by distance"
        >
          {RADIUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      <select
        value={day ?? ""}
        onChange={(e) =>
          onDayChange(
            e.target.value ? (e.target.value as DayOfWeek) : undefined
          )
        }
        className="rounded-lg border bg-background px-3 py-2 text-sm"
        aria-label="Filter by day"
      >
        <option value="">Any day</option>
        {DAYS_OF_WEEK.map((d) => (
          <option key={d} value={d}>
            {formatDay(d)}
          </option>
        ))}
      </select>

      <select
        value={mealType ?? ""}
        onChange={(e) =>
          onMealTypeChange(
            e.target.value ? (e.target.value as MealType) : undefined
          )
        }
        className="rounded-lg border bg-background px-3 py-2 text-sm"
        aria-label="Filter by meal type"
      >
        <option value="">Any meal</option>
        {MEAL_TYPES.map((m) => (
          <option key={m} value={m}>
            {formatMealType(m)}
          </option>
        ))}
      </select>

      <button
        onClick={() => onOpenNowChange(!openNow)}
        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
          openNow
            ? "border-green-600 bg-green-50 text-green-700"
            : "bg-background hover:bg-accent/50"
        }`}
        aria-pressed={openNow}
      >
        Open now
      </button>

      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
          aria-label="Clear all filters"
        >
          <X className="h-3 w-3" aria-hidden="true" />
          Clear
        </button>
      )}
    </div>
  );
}
