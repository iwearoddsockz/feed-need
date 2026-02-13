import type { DayOfWeek } from "@/types/location";
import { DAYS_OF_WEEK } from "./constants";

/**
 * Get the current day of week as our DayOfWeek enum value.
 */
export function getCurrentDay(): DayOfWeek {
  const jsDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  // Convert to our enum: monday=0, ..., sunday=6
  const idx = jsDay === 0 ? 6 : jsDay - 1;
  return DAYS_OF_WEEK[idx];
}

/**
 * Check if a given time string (HH:mm) is between start and end times.
 */
export function isTimeBetween(
  current: string,
  start: string,
  end: string
): boolean {
  return current >= start && current <= end;
}

/**
 * Get the current time as HH:mm string.
 */
export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/**
 * Format a day_of_week enum value for display.
 */
export function formatDay(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/**
 * Format a day_of_week enum value as a short abbreviation.
 */
export function formatDayShort(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1, 3);
}

/**
 * Format a time string (HH:mm) for display (12-hour format).
 */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, "0")}${period}`;
}
