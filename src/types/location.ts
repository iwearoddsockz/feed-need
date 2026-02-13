export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "food_parcel"
  | "pantry";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface MealLocation {
  id: string;
  name: string;
  organisation: string | null;
  description: string | null;
  street_address: string;
  suburb: string;
  postcode: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  eligibility_criteria: string | null;
  referral_required: boolean;
  wheelchair_accessible: boolean;
  is_active: boolean;
  last_verified_at: string | null;
  notes: string | null;
  operating_schedules: OperatingSchedule[];
}

export interface OperatingSchedule {
  id: string;
  location_id: string;
  day: DayOfWeek;
  meal_type: MealType;
  start_time: string;
  end_time: string;
  notes: string | null;
  is_active: boolean;
}
