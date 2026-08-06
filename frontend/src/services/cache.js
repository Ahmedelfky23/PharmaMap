/**
 * Persistent localStorage cache with TTL.
 *
 * Why localStorage instead of in-memory?
 *   In-memory cache lives only for the current tab session.
 *   localStorage survives page refreshes and even tab closes,
 *   so the first paint after a reload can show real data instantly.
 */

const PREFIX = "pharmamap_cache:";

/**
 * Write a value to localStorage with an expiry timestamp.
 * Silently no-ops if storage is full (QuotaExceededError).
 */
export function cacheSet(key, data, ttlMs = 30 * 60 * 1000) {
  try {
    const entry = { data, expiresAt: Date.now() + ttlMs };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // Quota exceeded or private browsing – just skip caching
  }
}

/**
 * Read a value from localStorage.
 * Returns null if missing or expired.
 */
export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Remove a specific entry from the cache.
 */
export function cacheDelete(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}
