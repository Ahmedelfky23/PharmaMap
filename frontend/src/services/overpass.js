const OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter";

// In-memory cache: key -> { data, timestamp }
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch pharmacies near a specific location within a given radius (meters).
 * Results are cached for 5 minutes so re-visits to the same area are instant.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} radiusMeters
 * @param {AbortSignal} [signal] - optional AbortController signal
 */
export async function getNearbyPharmacies(
  lat,
  lon,
  radiusMeters = 3000,
  signal
) {
  // Round to ~110m grid so nearby points share the same cache key
  const roundedLat = Math.round(lat * 1000) / 1000;
  const roundedLon = Math.round(lon * 1000) / 1000;
  const cacheKey = `nearby:${roundedLat}:${roundedLon}:${radiusMeters}`;

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const query = `
[out:json][timeout:25];
(
  node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
  way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
  relation["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
);
out center tags;
`;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch nearby pharmacies.");
  }

  const data = await response.json();
  setCache(cacheKey, data.elements);
  return data.elements;
}

/**
 * Fetch ALL pharmacies in Egypt (used when user skips location).
 * Results are cached for 5 minutes.
 *
 * @param {AbortSignal} [signal] - optional AbortController signal
 */
export async function getEgyptPharmacies(signal) {
  const cacheKey = "egypt:all";

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const query = `
[out:json][timeout:60];

area["ISO3166-1"="EG"][admin_level=2]->.egypt;

(
  node["amenity"="pharmacy"](area.egypt);
  way["amenity"="pharmacy"](area.egypt);
  relation["amenity"="pharmacy"](area.egypt);
);

out center tags;
`;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pharmacies.");
  }

  const data = await response.json();
  setCache(cacheKey, data.elements);
  return data.elements;
}