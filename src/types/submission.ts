import type { MealType, DayOfWeek } from "./location";

export type SubmissionType = "new_location" | "edit_suggestion";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface SubmissionFormData {
  name: string;
  organisation: string;
  description: string;
  street_address: string;
  suburb: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  eligibility_criteria: string;
  referral_required: boolean;
  wheelchair_accessible: boolean;
}

export interface ScheduleInput {
  day: DayOfWeek;
  meal_type: MealType;
  start_time: string;
  end_time: string;
  notes: string;
}

export interface SubmissionPayload {
  submission_type: SubmissionType;
  location_id?: string;
  submitted_data: SubmissionFormData & {
    latitude?: number;
    longitude?: number;
  };
  submitted_schedules: ScheduleInput[];
  submitter_notes: string;
  timestamp: number;
}
