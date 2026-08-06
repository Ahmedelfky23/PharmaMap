/**
 * OSM pharmacy data via a backend proxy.
 *
 * All Overpass QL queries are forwarded through POST /api/osm on our own backend.
 * This avoids browser-level CORS blocks, mobile-network firewalls, and per-IP
 * rate-limits that affected direct browser → overpass-api.de requests.
 */

import api from "./api";
import { cacheGet, cacheSet } from "./cache";

// In-memory fallback for within-session deduplication (very fast, complements localStorage)
const memCache = new Map();
const MEM_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Persistent cache TTLs
const NEARBY_TTL_MS = 20 * 60 * 1000; // 20 minutes for nearby results
const EGYPT_TTL_MS  = 30 * 60 * 1000; // 30 minutes for Egypt-wide results

function getFromAnyCache(key) {
  // 1. Check fast in-memory cache first
  const mem = memCache.get(key);
  if (mem && Date.now() - mem.timestamp < MEM_TTL_MS) return mem.data;
  // 2. Fall back to localStorage (survives page refresh)
  const persistent = cacheGet(key);
  if (persistent !== null) {
    // Warm the in-memory cache so subsequent calls in this session are instant
    memCache.set(key, { data: persistent, timestamp: Date.now() });
    return persistent;
  }
  return null;
}

function saveToAllCaches(key, data, ttlMs) {
  memCache.set(key, { data, timestamp: Date.now() });
  cacheSet(key, data, ttlMs);
}

/**
 * Send a query to our backend OSM proxy (POST /api/osm).
 * The backend tries multiple Overpass endpoints server-side.
 */
async function overpassQuery(query) {
  const response = await api.post("/osm", { query });
  return response.data.elements ?? [];
}

/**
 * Fetch pharmacies near a specific location within a given radius (meters).
 * Results are cached for 20 minutes so re-visits to the same area are instant.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} radiusMeters
 */
export async function getNearbyPharmacies(lat, lon, radiusMeters = 3000) {
  // Round to ~110 m grid so nearby points share the same cache key
  const roundedLat = Math.round(lat * 1000) / 1000;
  const roundedLon = Math.round(lon * 1000) / 1000;
  const cacheKey = `nearby:${roundedLat}:${roundedLon}:${radiusMeters}`;

  const cached = getFromAnyCache(cacheKey);
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
  saveToAllCaches(cacheKey, elements, NEARBY_TTL_MS);
  return elements;
}

/**
 * Fetch ALL pharmacies in Egypt (used when user skips location).
 * Results are cached for 30 minutes.
 */
export async function getEgyptPharmacies() {
  const cacheKey = "egypt:all";

  const cached = getFromAnyCache(cacheKey);
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
  saveToAllCaches(cacheKey, elements, EGYPT_TTL_MS);
  return elements;
}