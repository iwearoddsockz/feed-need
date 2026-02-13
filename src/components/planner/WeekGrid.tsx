"use client";

import { useState } from "react";
import type { DayOfWeek } from "@/types/location";
import { DAYS_OF_WEEK, MEAL_SLOT_TYPES } from "@/lib/utils/constants";
import { getCurrentDay, formatDay, formatDayShort } from "@/lib/utils/date";
import { MealSlot } from "./MealSlot";

export function WeekGrid() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDay());

  return (
    <div>
      {/* Mobile: day tabs + single day view */}
      <div className="lg:hidden">
        <nav
          className="flex gap-1 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Days of the week"
        >
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              role="tab"
              aria-selected={day === selectedDay}
              aria-controls={`panel-${day}`}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                day === selectedDay
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {formatDayShort(day)}
            </button>
          ))}
        </nav>

        <div
          id={`panel-${selectedDay}`}
          role="tabpanel"
          aria-label={formatDay(selectedDay)}
          className="mt-3 space-y-3"
        >
          {MEAL_SLOT_TYPES.map((slot) => (
            <MealSlot key={`${selectedDay}-${slot}`} day={selectedDay} slot={slot} />
          ))}
        </div>
      </div>

      {/* Desktop: full week grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-3">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day}>
              <h2 className="mb-2 text-center text-sm font-semibold">
                {formatDay(day)}
              </h2>
              <div className="space-y-2">
                {MEAL_SLOT_TYPES.map((slot) => (
                  <MealSlot key={`${day}-${slot}`} day={day} slot={slot} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
