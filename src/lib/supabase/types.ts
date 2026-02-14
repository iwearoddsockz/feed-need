import type {
  MealType,
  DayOfWeek,
  MealLocation,
  OperatingSchedule,
} from "@/types/location";
import type { Suburb } from "@/types/suburb";
import type {
  SubmissionType,
  SubmissionStatus,
} from "@/types/submission";

/**
 * Database type definitions for Supabase.
 *
 * In production, generate these with:
 *   supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 *
 * These manual types match the schema in supabase/migrations/.
 */
export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string;
          name: string;
          organisation: string | null;
          description: string | null;
          street_address: string;
          suburb: string;
          postcode: string;
          state: string;
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["locations"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["locations"]["Insert"]>;
      };
      operating_schedules: {
        Row: {
          id: string;
          location_id: string;
          day: DayOfWeek;
          meal_type: MealType;
          start_time: string;
          end_time: string;
          notes: string | null;
          is_active: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["operating_schedules"]["Row"],
          "id"
        > & {
          id?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["operating_schedules"]["Insert"]
        >;
      };
      suburbs: {
        Row: {
          id: number;
          name: string;
          postcode: string;
          latitude: number | null;
          longitude: number | null;
          lga: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["suburbs"]["Row"], "id"> & {
          id?: number;
        };
        Update: Partial<Database["public"]["Tables"]["suburbs"]["Insert"]>;
      };
      submissions: {
        Row: {
          id: string;
          submission_type: SubmissionType;
          status: SubmissionStatus;
          location_id: string | null;
          submitted_data: Record<string, unknown>;
          submitted_schedules: Record<string, unknown>[] | null;
          submitter_notes: string | null;
          admin_notes: string | null;
          submission_ip_hash: string | null;
          created_at: string;
          reviewed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["submissions"]["Row"],
          "id" | "status" | "admin_notes" | "created_at" | "reviewed_at"
        > & {
          id?: string;
          status?: SubmissionStatus;
          admin_notes?: string | null;
          created_at?: string;
          reviewed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["submissions"]["Insert"]>;
      };
    };
    Enums: {
      meal_type: MealType;
      day_of_week: DayOfWeek;
      submission_type: SubmissionType;
      submission_status: SubmissionStatus;
    };
  };
}

// Convenience type aliases for use across the app
export type LocationRow = Database["public"]["Tables"]["locations"]["Row"];
export type ScheduleRow =
  Database["public"]["Tables"]["operating_schedules"]["Row"];
export type SuburbRow = Database["public"]["Tables"]["suburbs"]["Row"];
export type SubmissionRow =
  Database["public"]["Tables"]["submissions"]["Row"];

// Re-export domain types for convenience
export type { MealLocation, OperatingSchedule, MealType, DayOfWeek, Suburb };
export type { SubmissionType, SubmissionStatus };
