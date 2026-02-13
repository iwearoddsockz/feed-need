export const PERTH_CENTRE = {
  latitude: -31.9505,
  longitude: 115.8605,
} as const;

export const DEFAULT_MAP_ZOOM = 11;

export const PERTH_METRO_BOUNDS = {
  northWest: { latitude: -31.65, longitude: 115.6 },
  southEast: { latitude: -32.25, longitude: 116.1 },
} as const;

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const MEAL_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "food_parcel",
  "pantry",
] as const;

export const MEAL_SLOT_TYPES = ["breakfast", "lunch", "dinner"] as const;
