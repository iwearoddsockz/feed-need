import type { MealLocation, OperatingSchedule } from "@/types/location";
import { getCurrentDay, getCurrentTime, isTimeBetween } from "./date";

export type MarkerStatus = "serving" | "today" | "closed";

export function getMarkerStatus(location: MealLocation): MarkerStatus {
  const currentDay = getCurrentDay();
  const currentTime = getCurrentTime();

  const todaySchedules = location.operating_schedules.filter(
    (s) => s.day === currentDay && s.is_active
  );

  if (todaySchedules.length === 0) return "closed";

  const servingNow = todaySchedules.some((s) =>
    isTimeBetween(currentTime, s.start_time, s.end_time)
  );

  return servingNow ? "serving" : "today";
}

export function getTodaySchedules(
  location: MealLocation
): OperatingSchedule[] {
  const currentDay = getCurrentDay();
  return location.operating_schedules.filter(
    (s) => s.day === currentDay && s.is_active
  );
}
