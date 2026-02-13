/**
 * Format a full address for display.
 */
export function formatAddress(
  streetAddress: string,
  suburb: string,
  postcode: string
): string {
  return `${streetAddress}, ${suburb} WA ${postcode}`;
}

/**
 * Generate a Google Maps directions URL.
 */
export function getDirectionsUrl(
  latitude: number,
  longitude: number,
  label?: string
): string {
  const destination = `${latitude},${longitude}`;
  const q = label ? encodeURIComponent(label) : destination;
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${q}`;
}

/**
 * Format a meal type enum value for display.
 */
export function formatMealType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
