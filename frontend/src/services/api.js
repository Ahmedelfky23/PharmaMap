import axios from "axios";

const BACKEND_URL = "https://pharmamap-60d8.onrender.com/api";

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000, // 15 ثانية max — بعدها بيفشل بدل ما يفضل ينتظر للأبد
});

/**
 * يرسل ping للـ Render backend عشان يصحّيه من الـ cold start.
 * يُستدعى مرة واحدة عند فتح التطبيق في الخلفية.
 */
export async function pingBackend() {
  try {
    await fetch(`${BACKEND_URL.replace("/api", "")}/ping`, {
      method: "GET",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    // Ignore — المهم إننا بعتنا الـ ping
  }
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

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
  } catch (error) {
    console.error("Failed to cache data:", error);
  }
}

export async function getDBPharmacies(forceRefresh = false) {
  const CACHE_KEY = "pharmamap_db_pharmacies";
  const cached = cacheGet(CACHE_KEY);

  if (cached && !forceRefresh) {
    if (cached.age > CACHE_TTL_MS) {
      api.get("/pharmacies")
        .then((res) => cacheSet(CACHE_KEY, res.data))
        .catch(() => {});
    }
    return cached.data;
  }

  const res = await api.get("/pharmacies");
  cacheSet(CACHE_KEY, res.data);
  return res.data;
}

export default api;