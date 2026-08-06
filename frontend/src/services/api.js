import axios from "axios";

const api = axios.create({
  baseURL: "https://pharmamap-60d8.onrender.com/api",
});

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

export async function getDBPharmacies() {
  const CACHE_KEY = "pharmamap_db_pharmacies";
  const cached = cacheGet(CACHE_KEY);
  if (cached) return cached;
  
  const res = await api.get("/pharmacies");
  cacheSet(CACHE_KEY, res.data);
  return res.data;
}

export default api;