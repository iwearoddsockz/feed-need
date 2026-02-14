import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      submission_type,
      location_id,
      submitted_data,
      submitted_schedules,
      submitter_notes,
      timestamp,
    } = body;

    // Validate submission type
    if (!["new_location", "edit_suggestion"].includes(submission_type)) {
      return NextResponse.json(
        { error: "Invalid submission type." },
        { status: 400 }
      );
    }

    // Validate required data
    if (!submitted_data || !submitted_data.name || !submitted_data.street_address) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Time-based bot check (< 3 seconds = likely bot)
    if (typeof timestamp === "number" && Date.now() - timestamp < 3000) {
      return NextResponse.json(
        { error: "Please wait a moment before submitting." },
        { status: 400 }
      );
    }

    // Hash IP for rate limiting (privacy-preserving)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    const supabase = await createServerSupabaseClient();

    // Rate limiting: max 3 submissions per IP per 24 hours
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { count } = await supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("submission_ip_hash", ipHash)
      .gte("created_at", twentyFourHoursAgo);

    if (count !== null && count >= 3) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again tomorrow." },
        { status: 429 }
      );
    }

    // Insert submission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("submissions").insert({
      submission_type,
      location_id: location_id || null,
      submitted_data,
      submitted_schedules: submitted_schedules || null,
      submitter_notes: submitter_notes || null,
      submission_ip_hash: ipHash,
    } as any);

    if (error) {
      console.error("Submission insert error:", error);
      return NextResponse.json(
        { error: "Failed to save submission." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
