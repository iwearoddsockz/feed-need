import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Connect to Supabase and return suburbs for autocomplete
  return NextResponse.json({ suburbs: [] });
}
