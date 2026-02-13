"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Navigation,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { MealLocation, DayOfWeek } from "@/types/location";
import {
  formatAddress,
  getDirectionsUrl,
  formatMealType,
} from "@/lib/utils/format";
import { formatDay, formatTime } from "@/lib/utils/date";
import { getMarkerStatus } from "@/lib/utils/location-status";
import { DAYS_OF_WEEK } from "@/lib/utils/constants";

interface LocationDetailProps {
  id: string;
}

export function LocationDetail({ id }: LocationDetailProps) {
  const [location, setLocation] = useState<MealLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from("locations")
          .select("*, operating_schedules(*)")
          .eq("id", id)
          .eq("is_active", true)
          .single();

        if (queryError) throw new Error(queryError.message);
        setLocation(data as MealLocation);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Location not found"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchLocation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading location</span>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="flex items-center gap-2 text-destructive" role="alert">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
          <p>{error ?? "Location not found"}</p>
        </div>
        <Link
          href="/search"
          className="text-sm text-primary underline underline-offset-2"
        >
          Back to search
        </Link>
      </div>
    );
  }

  const status = getMarkerStatus(location);

  const scheduleByDay = new Map<
    DayOfWeek,
    typeof location.operating_schedules
  >();
  for (const s of location.operating_schedules) {
    if (!s.is_active) continue;
    const existing = scheduleByDay.get(s.day) || [];
    existing.push(s);
    scheduleByDay.set(s.day, existing);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4">
      <Link
        href="/search"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to search
      </Link>

      <h1 className="text-2xl font-bold">{location.name}</h1>
      {location.organisation && location.organisation !== location.name && (
        <p className="text-lg text-muted-foreground">
          {location.organisation}
        </p>
      )}

      {/* Status badge */}
      <div className="mt-3">
        {status === "serving" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            <span
              className="h-2 w-2 rounded-full bg-green-600"
              aria-hidden="true"
            />
            Serving now
          </span>
        )}
        {status === "today" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            <span
              className="h-2 w-2 rounded-full bg-blue-600"
              aria-hidden="true"
            />
            Open today
          </span>
        )}
        {status === "closed" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            <span
              className="h-2 w-2 rounded-full bg-gray-400"
              aria-hidden="true"
            />
            Closed today
          </span>
        )}
      </div>

      {/* Contact info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <MapPin
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span>
            {formatAddress(
              location.street_address,
              location.suburb,
              location.postcode
            )}
          </span>
        </div>
        {location.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <a href={`tel:${location.phone}`} className="text-primary underline">
              {location.phone}
            </a>
          </div>
        )}
        {location.website && (
          <div className="flex items-center gap-2 text-sm">
            <Globe
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <a
              href={location.website}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-primary underline"
            >
              {location.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>

      {/* Description */}
      {location.description && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            About
          </h2>
          <p className="mt-1 text-sm leading-relaxed">{location.description}</p>
        </div>
      )}

      {/* Accessibility & Eligibility */}
      <div className="mt-4 flex flex-wrap gap-2">
        {location.wheelchair_accessible && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
            Wheelchair accessible
          </span>
        )}
        {location.referral_required && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
            Referral required
          </span>
        )}
      </div>

      {location.eligibility_criteria && (
        <div className="mt-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Eligibility
          </h2>
          <p className="mt-1 text-sm">{location.eligibility_criteria}</p>
        </div>
      )}

      {/* Schedule */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Opening hours
        </h2>
        {scheduleByDay.size === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No scheduled hours available.
          </p>
        ) : (
          <div className="mt-2 space-y-3">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedules = scheduleByDay.get(day);
              if (!daySchedules || daySchedules.length === 0) return null;
              return (
                <div key={day}>
                  <h3 className="text-sm font-medium">{formatDay(day)}</h3>
                  <div className="ml-4 space-y-0.5">
                    {daySchedules.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {formatMealType(s.meal_type)}:{" "}
                          {formatTime(s.start_time)}
                          {"\u2013"}
                          {formatTime(s.end_time)}
                        </span>
                        {s.notes && (
                          <span className="italic">({s.notes})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notes */}
      {location.notes && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Notes
          </h2>
          <p className="mt-1 text-sm leading-relaxed">{location.notes}</p>
        </div>
      )}

      {/* Directions CTA */}
      <div className="mt-6 pb-4">
        <a
          href={getDirectionsUrl(
            location.latitude,
            location.longitude,
            location.name
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground"
        >
          <Navigation className="h-5 w-5" aria-hidden="true" />
          Get directions
        </a>
      </div>
    </div>
  );
}
