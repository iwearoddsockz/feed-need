/**
 * Calculate the distance between two coordinates using the Haversine formula.
 * Returns distance in kilometres.
 */
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Sort locations by distance from a given point.
 * Returns a new array with a `distance` property added.
 */
export function sortByDistance<T extends { latitude: number; longitude: number }>(
  items: T[],
  fromLat: number,
  fromLon: number
): (T & { distance: number })[] {
  return items
    .map((item) => ({
      ...item,
      distance: distanceKm(fromLat, fromLon, item.latitude, item.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Format distance for display.
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}
