// Multiple Overpass endpoints — tried in order until one succeeds.
// kumi.systems is often down/rate-limited, so we fall back to the official mirrors.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

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
 * POST a query to the Overpass API, trying each endpoint in order.
 * Returns parsed JSON elements array.
 */
async function overpassQuery(query) {
  let lastError;

  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: query,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}`);
      }

      const data = await response.json();
      return data.elements;
    } catch (err) {
      console.warn(`Overpass endpoint failed (${url}):`, err.message);
      lastError = err;
      // Try the next endpoint
    }
  }

  throw new Error(
    `All Overpass endpoints failed. Last error: ${lastError?.message}`
  );
}

/**
 * Fetch pharmacies near a specific location within a given radius (meters).
 * Results are cached for 5 minutes so re-visits to the same area are instant.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} radiusMeters
 */
export async function getNearbyPharmacies(lat, lon, radiusMeters = 3000) {
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

  const elements = await overpassQuery(query);
  setCache(cacheKey, elements);
  return elements;
}

/**
 * Fetch ALL pharmacies in Egypt (used when user skips location).
 * Results are cached for 5 minutes.
 */
export async function getEgyptPharmacies() {
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

  const elements = await overpassQuery(query);
  setCache(cacheKey, elements);
  return elements;
}