import type { NearbyBusStop, NearbyTrainStation } from "@/types/location";

const WALK_SPEED_KMH = 5;

/** Estimate walking time in minutes from distance in metres */
export function walkMinutes(distanceM: number): number {
  return Math.round((distanceM / 1000 / WALK_SPEED_KMH) * 60);
}

/** Transperth live timetable URL for a stop number */
export function getStopUrl(stopId: string): string {
  return `https://www.transperth.wa.gov.au/Timetables/LiveTimetables?StopNumber=${encodeURIComponent(stopId)}`;
}

/** Transperth journey planner URL */
export function getJourneyPlannerUrl(): string {
  return "https://www.transperth.wa.gov.au/Journey-Planner";
}

/** Google Maps walking directions to a lat/lng */
export function getWalkingDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

/** Format a bus stop for compact display: "Stop 12345 (150m)" */
export function formatBusStopCompact(stop: NearbyBusStop): string {
  return `Stop ${stop.stop_id} (${stop.distance_m}m)`;
}

/** Format a train station for compact display: "Perth Stn (500m)" */
export function formatTrainStationCompact(station: NearbyTrainStation): string {
  const shortName = station.name.replace(/ Station$/i, " Stn");
  return `${shortName} (${station.distance_m}m)`;
}
