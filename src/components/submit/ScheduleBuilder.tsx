"use client";

import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/lib/utils/constants";
import { formatDay } from "@/lib/utils/date";
import { formatMealType } from "@/lib/utils/format";
import type { ScheduleInput } from "@/types/submission";
import type { DayOfWeek, MealType } from "@/types/location";

interface ScheduleBuilderProps {
  schedules: ScheduleInput[];
  onChange: (schedules: ScheduleInput[]) => void;
}

export function ScheduleBuilder({ schedules, onChange }: ScheduleBuilderProps) {
  function addSchedule() {
    onChange([
      ...schedules,
      {
        day: "monday",
        meal_type: "lunch",
        start_time: "",
        end_time: "",
        notes: "",
      },
    ]);
  }

  function removeSchedule(index: number) {
    onChange(schedules.filter((_, i) => i !== index));
  }

  function updateSchedule(
    index: number,
    field: keyof ScheduleInput,
    value: string
  ) {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {schedules.map((schedule, index) => (
        <div key={index} className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium">
              Service time {index + 1}
            </span>
            {schedules.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => removeSchedule(index)}
                aria-label={`Remove service time ${index + 1}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`day-${index}`}>Day</Label>
              <Select
                value={schedule.day}
                onValueChange={(v) => updateSchedule(index, "day", v)}
              >
                <SelectTrigger id={`day-${index}`} className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day} value={day}>
                      {formatDay(day as DayOfWeek)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`meal-${index}`}>Meal type</Label>
              <Select
                value={schedule.meal_type}
                onValueChange={(v) => updateSchedule(index, "meal_type", v)}
              >
                <SelectTrigger id={`meal-${index}`} className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatMealType(type as MealType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`start-${index}`}>Start time</Label>
              <Input
                id={`start-${index}`}
                type="time"
                value={schedule.start_time}
                onChange={(e) =>
                  updateSchedule(index, "start_time", e.target.value)
                }
                className="mt-1"
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor={`end-${index}`}>End time</Label>
              <Input
                id={`end-${index}`}
                type="time"
                value={schedule.end_time}
                onChange={(e) =>
                  updateSchedule(index, "end_time", e.target.value)
                }
                className="mt-1"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="mt-3">
            <Label htmlFor={`schedule-notes-${index}`}>
              Notes{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id={`schedule-notes-${index}`}
              type="text"
              placeholder="e.g. Last Friday of each month only"
              value={schedule.notes}
              onChange={(e) =>
                updateSchedule(index, "notes", e.target.value)
              }
              className="mt-1"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addSchedule}
        className="w-full"
      >
        <PlusCircle className="h-4 w-4" aria-hidden="true" />
        Add service time
      </Button>
    </div>
  );
}
