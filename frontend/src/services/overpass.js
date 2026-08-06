const OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter";

// --- Cache helpers ---
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function cacheSet(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // Ignore quota errors
  }
}

export async function getEgyptPharmacies() {
  const CACHE_KEY = "pharmamap_egypt_osm";
  const cached = cacheGet(CACHE_KEY);
  if (cached) return cached;

  const query = `
[out:json][timeout:25];

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
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pharmacies.");
  }

  const data = await response.json();
  cacheSet(CACHE_KEY, data.elements);
  return data.elements;
}

// Fetch pharmacies near a specific location within a given radius (meters)
export async function getNearbyPharmacies(lat, lon, radiusMeters = 3000) {
  const CACHE_KEY = `pharmamap_nearby_${lat.toFixed(2)}_${lon.toFixed(2)}_${radiusMeters}`;
  const cached = cacheGet(CACHE_KEY);
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
  });

  if (!response.ok) {
    throw new Error("Failed to fetch nearby pharmacies.");
  }

  const data = await response.json();
  cacheSet(CACHE_KEY, data.elements);
  return data.elements;
}