const OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 دقائق

// ─── Cache helpers ──────────────────────────────────────────────────────────
function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    return { data, age: Date.now() - ts };
  } catch {
    return null;
  }
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // localStorage ممكن يكون ممتلى على الموبايل — نتجاهل الـ error
  }
}

// ─── Fetch from Overpass ────────────────────────────────────────────────────
async function fetchFromOverpass(query) {
  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Failed to fetch from Overpass.");
  const data = await response.json();
  return data.elements;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * بيجيب كل صيدليات مصر مع localStorage cache (10 دقائق).
 * لو في cache ← بيرجع البيانات فوراً وبيحدّث في الخلفية لو الـ cache قديم.
 */
export async function getEgyptPharmacies() {
  const CACHE_KEY = "pharmamap_egypt_osm";
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

  const cached = cacheGet(CACHE_KEY);

  if (cached) {
    // عندنا cache — نرجع البيانات فوراً
    if (cached.age > CACHE_TTL_MS) {
      // الـ cache قديم → نحدّثه في الخلفية بعد ما نرجع البيانات
      fetchFromOverpass(query)
        .then((fresh) => cacheSet(CACHE_KEY, fresh))
        .catch(() => {});
    }
    return cached.data;
  }

  // مفيش cache — نجيب من الـ API
  const data = await fetchFromOverpass(query);
  cacheSet(CACHE_KEY, data);
  return data;
}

/**
 * بيجيب الصيدليات القريبة مع localStorage cache (10 دقائق) لكل موقع.
 */
export async function getNearbyPharmacies(lat, lon, radiusMeters = 3000) {
  // Key فريد لكل موقع (مقرّب لـ 2 خانات عشرية = ~1km دقة)
  const CACHE_KEY = `pharmamap_nearby_${lat.toFixed(2)}_${lon.toFixed(2)}_${radiusMeters}`;
  const query = `
[out:json][timeout:25];
(
  node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
  way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
  relation["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
);
out center tags;
`;

  const cached = cacheGet(CACHE_KEY);

  if (cached) {
    if (cached.age > CACHE_TTL_MS) {
      fetchFromOverpass(query)
        .then((fresh) => cacheSet(CACHE_KEY, fresh))
        .catch(() => {});
    }
    return cached.data;
  }

  const data = await fetchFromOverpass(query);
  cacheSet(CACHE_KEY, data);
  return data;
}