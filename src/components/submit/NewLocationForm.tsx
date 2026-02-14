"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScheduleBuilder } from "./ScheduleBuilder";
import { useSuburbs } from "@/lib/hooks/useSuburbs";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { geocodeAddress } from "@/lib/utils/geocode";
import type { SubmissionFormData, ScheduleInput } from "@/types/submission";
import type { MealLocation } from "@/types/location";

const INITIAL_FORM: SubmissionFormData = {
  name: "",
  organisation: "",
  description: "",
  street_address: "",
  suburb: "",
  postcode: "",
  phone: "",
  email: "",
  website: "",
  eligibility_criteria: "",
  referral_required: false,
  wheelchair_accessible: true,
};

const INITIAL_SCHEDULE: ScheduleInput = {
  day: "monday",
  meal_type: "lunch",
  start_time: "",
  end_time: "",
  notes: "",
};

interface NewLocationFormProps {
  /** Pre-fill form for edit suggestions */
  prefill?: MealLocation;
  /** When set, submits as edit_suggestion with this location_id */
  locationId?: string;
  /** Called after successful submission */
  onSuccess?: () => void;
}

export function NewLocationForm({
  prefill,
  locationId,
  onSuccess,
}: NewLocationFormProps) {
  const isEdit = !!locationId;

  const [form, setForm] = useState<SubmissionFormData>(() => {
    if (prefill) {
      return {
        name: prefill.name,
        organisation: prefill.organisation ?? "",
        description: prefill.description ?? "",
        street_address: prefill.street_address,
        suburb: prefill.suburb,
        postcode: prefill.postcode,
        phone: prefill.phone ?? "",
        email: prefill.email ?? "",
        website: prefill.website ?? "",
        eligibility_criteria: prefill.eligibility_criteria ?? "",
        referral_required: prefill.referral_required,
        wheelchair_accessible: prefill.wheelchair_accessible,
      };
    }
    return { ...INITIAL_FORM };
  });

  const [schedules, setSchedules] = useState<ScheduleInput[]>(() => {
    if (prefill?.operating_schedules?.length) {
      return prefill.operating_schedules
        .filter((s) => s.is_active)
        .map((s) => ({
          day: s.day,
          meal_type: s.meal_type,
          start_time: s.start_time,
          end_time: s.end_time,
          notes: s.notes ?? "",
        }));
    }
    return [{ ...INITIAL_SCHEDULE }];
  });

  const [submitterNotes, setSubmitterNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timestampRef = useRef(Date.now());
  const isOnline = useOnlineStatus();

  // Suburb combobox state
  const [suburbInput, setSuburbInput] = useState(
    prefill ? `${prefill.suburb} (${prefill.postcode})` : ""
  );
  const [suburbOpen, setSuburbOpen] = useState(false);
  const [suburbActiveIndex, setSuburbActiveIndex] = useState(-1);
  const { suburbs } = useSuburbs(suburbInput);
  const suburbWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suburbWrapperRef.current &&
        !suburbWrapperRef.current.contains(e.target as Node)
      ) {
        setSuburbOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSuburbOpen(suburbs.length > 0 && suburbInput.length >= 2 && !form.suburb);
    setSuburbActiveIndex(-1);
  }, [suburbs, suburbInput, form.suburb]);

  function handleSuburbSelect(name: string, postcode: string) {
    setSuburbInput(`${name} (${postcode})`);
    setSuburbOpen(false);
    setForm((f) => ({ ...f, suburb: name, postcode }));
  }

  function handleSuburbKeyDown(e: React.KeyboardEvent) {
    if (!suburbOpen) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSuburbActiveIndex((i) => Math.min(i + 1, suburbs.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSuburbActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (suburbActiveIndex >= 0 && suburbs[suburbActiveIndex]) {
          const s = suburbs[suburbActiveIndex];
          handleSuburbSelect(s.name, s.postcode);
        }
        break;
      case "Escape":
        setSuburbOpen(false);
        break;
    }
  }

  function updateField(field: keyof SubmissionFormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Location name is required.";
    if (!form.street_address.trim()) return "Street address is required.";
    if (!form.suburb.trim()) return "Suburb is required.";
    if (!/^\d{4}$/.test(form.postcode)) return "Postcode must be 4 digits.";

    if (schedules.length === 0) return "Add at least one service time.";

    for (let i = 0; i < schedules.length; i++) {
      const s = schedules[i];
      if (!s.start_time || !s.end_time) {
        return `Service time ${i + 1} needs start and end times.`;
      }
    }

    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    // Honeypot check — silently succeed for bots
    if (honeypot) {
      toast.success("Thank you! We will review your submission.");
      setSubmitted(true);
      return;
    }

    setLoading(true);

    try {
      // Geocode the address
      const coords = await geocodeAddress(
        form.street_address,
        form.suburb,
        form.postcode
      );

      if (!coords && !isEdit) {
        toast.error(
          "We could not find this address on the map. Please check the spelling and try again."
        );
        setLoading(false);
        return;
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_type: isEdit ? "edit_suggestion" : "new_location",
          location_id: locationId,
          submitted_data: coords ? { ...form, ...coords } : form,
          submitted_schedules: schedules,
          submitter_notes: submitterNotes,
          timestamp: timestampRef.current,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Submission failed.");
      }

      toast.success("Thank you! We will review your submission.");
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted && !isEdit) {
    return (
      <div className="mt-8 rounded-lg border border-green-500/50 bg-green-50 p-6 text-center dark:bg-green-950/20">
        <h2 className="text-lg font-semibold">Submission received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We will review your submission and add it to the site if everything
          checks out. Thank you for helping others find free meals.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setForm({ ...INITIAL_FORM });
            setSchedules([{ ...INITIAL_SCHEDULE }]);
            setSubmitterNotes("");
            setSubmitted(false);
            timestampRef.current = Date.now();
          }}
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-8">
      {!isOnline && (
        <div
          className="rounded-lg border border-yellow-500/50 bg-yellow-50 p-4 text-sm dark:bg-yellow-950/20"
          role="alert"
        >
          You are offline. Connect to the internet to submit.
        </div>
      )}

      {/* Honeypot — hidden from humans */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website_url">Leave this blank</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Basic info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Basic info</legend>

        <div>
          <Label htmlFor="name">
            Location name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g. St Vincent's Community Kitchen"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="mt-1"
            required
            aria-required="true"
          />
        </div>

        <div>
          <Label htmlFor="organisation">
            Organisation{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Input
            id="organisation"
            type="text"
            placeholder="e.g. St Vincent de Paul Society"
            value={form.organisation}
            onChange={(e) => updateField("organisation", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">
            Description{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Textarea
            id="description"
            placeholder="What does this service offer?"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="mt-1"
            maxLength={500}
            rows={3}
          />
        </div>
      </fieldset>

      {/* Address */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Address</legend>

        <div>
          <Label htmlFor="street_address">
            Street address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="street_address"
            type="text"
            placeholder="e.g. 123 Main Street"
            value={form.street_address}
            onChange={(e) => updateField("street_address", e.target.value)}
            className="mt-1"
            required
            aria-required="true"
          />
        </div>

        <div ref={suburbWrapperRef} className="relative">
          <Label htmlFor="suburb">
            Suburb <span className="text-destructive">*</span>
          </Label>
          <Input
            id="suburb"
            type="text"
            role="combobox"
            aria-expanded={suburbOpen}
            aria-controls="submit-suburb-listbox"
            aria-activedescendant={
              suburbActiveIndex >= 0
                ? `submit-suburb-${suburbActiveIndex}`
                : undefined
            }
            placeholder="Start typing a suburb name..."
            value={suburbInput}
            onChange={(e) => {
              setSuburbInput(e.target.value);
              if (form.suburb) {
                setForm((f) => ({ ...f, suburb: "", postcode: "" }));
              }
            }}
            onKeyDown={handleSuburbKeyDown}
            onFocus={() =>
              suburbs.length > 0 && !form.suburb && setSuburbOpen(true)
            }
            className="mt-1"
            required
            aria-required="true"
          />
          {suburbOpen && suburbs.length > 0 && (
            <ul
              id="submit-suburb-listbox"
              role="listbox"
              className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-background shadow-lg"
            >
              {suburbs.map((s, i) => (
                <li
                  key={`${s.name}-${s.postcode}`}
                  id={`submit-suburb-${i}`}
                  role="option"
                  aria-selected={i === suburbActiveIndex}
                  className={`cursor-pointer px-4 py-3 text-base ${
                    i === suburbActiveIndex
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => handleSuburbSelect(s.name, s.postcode)}
                >
                  {s.name}{" "}
                  <span className="text-muted-foreground">
                    ({s.postcode})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Label htmlFor="postcode">
            Postcode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postcode"
            type="text"
            inputMode="numeric"
            pattern="\d{4}"
            placeholder="e.g. 6000"
            value={form.postcode}
            onChange={(e) => updateField("postcode", e.target.value)}
            className="mt-1 max-w-32"
            required
            aria-required="true"
          />
        </div>
      </fieldset>

      {/* Contact */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">
          Contact details{" "}
          <span className="text-base font-normal text-muted-foreground">
            (optional)
          </span>
        </legend>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. (08) 9000 0000"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. info@example.org"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="website-field">Website</Label>
          <Input
            id="website-field"
            type="url"
            placeholder="e.g. https://example.org"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
            className="mt-1"
          />
        </div>
      </fieldset>

      {/* Service details */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Service details</legend>

        <div>
          <Label htmlFor="eligibility">
            Who can use this service?{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Textarea
            id="eligibility"
            placeholder="e.g. Anyone welcome, no questions asked"
            value={form.eligibility_criteria}
            onChange={(e) =>
              updateField("eligibility_criteria", e.target.value)
            }
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="referral_required"
            checked={form.referral_required}
            onCheckedChange={(checked) =>
              updateField("referral_required", checked === true)
            }
          />
          <Label htmlFor="referral_required" className="font-normal">
            Referral required
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="wheelchair_accessible"
            checked={form.wheelchair_accessible}
            onCheckedChange={(checked) =>
              updateField("wheelchair_accessible", checked === true)
            }
          />
          <Label htmlFor="wheelchair_accessible" className="font-normal">
            Wheelchair accessible
          </Label>
        </div>
      </fieldset>

      {/* Operating hours */}
      <fieldset>
        <legend className="text-lg font-semibold">
          Service times <span className="text-destructive">*</span>
        </legend>
        <p className="mt-1 text-sm text-muted-foreground">
          When does this service run? Add at least one.
        </p>
        <div className="mt-3">
          <ScheduleBuilder schedules={schedules} onChange={setSchedules} />
        </div>
      </fieldset>

      {/* Additional notes */}
      <div>
        <Label htmlFor="submitter_notes">
          Anything else we should know?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="submitter_notes"
          placeholder="e.g. I volunteer here and can confirm the hours"
          value={submitterNotes}
          onChange={(e) => setSubmitterNotes(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading || !isOnline}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2
              className="h-4 w-4 animate-spin"
              aria-hidden="true"
            />
            Submitting...
          </>
        ) : isEdit ? (
          "Submit suggestion"
        ) : (
          "Submit service"
        )}
      </Button>
    </form>
  );
}
