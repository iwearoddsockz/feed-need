import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Connect to Supabase and return filtered locations
  return NextResponse.json({ locations: [] });
}
