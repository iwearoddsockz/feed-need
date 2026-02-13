import type { DayOfWeek } from "./location";

export type MealSlotType = "breakfast" | "lunch" | "dinner";

export interface PlannerEntry {
  id: string;
  day: DayOfWeek;
  slot: MealSlotType;
  location_id: string;
  location_name: string;
  location_address: string;
  location_suburb: string;
  start_time: string;
  end_time: string;
  notes: string;
}

export interface WeekPlan {
  entries: PlannerEntry[];
  created_at: string;
  updated_at: string;
}
