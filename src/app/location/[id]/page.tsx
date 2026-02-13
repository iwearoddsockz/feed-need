import type { Metadata } from "next";
import { LocationDetail } from "@/components/location/LocationDetail";

export const metadata: Metadata = {
  title: "Location Details",
};

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LocationDetail id={id} />;
}
