/**
 * Geocode a Perth address using OpenStreetMap's Nominatim API.
 * Free, no API key needed. Rate limit: 1 req/s (enforced by Nominatim).
 */
export async function geocodeAddress(
  streetAddress: string,
  suburb: string,
  postcode: string
): Promise<{ latitude: number; longitude: number } | null> {
  const query = encodeURIComponent(
    `${streetAddress}, ${suburb}, ${postcode}, Western Australia, Australia`
  );

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      {
        headers: {
          "User-Agent": "FeedNeed/1.0 (https://feed-need.vercel.app)",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch {
    return null;
  }
}
