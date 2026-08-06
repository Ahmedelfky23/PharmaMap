const axios = require("axios");

// Multiple Overpass endpoints — tried in order until one succeeds.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

/**
 * POST /api/osm
 * Body: { query: string }
 *
 * Proxies an Overpass QL query server-side (no CORS issues, better rate limits).
 * Tries each endpoint in order and returns the elements array on success.
 */
const proxyOverpass = async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Missing or invalid 'query' field in request body." });
  }

  let lastError = null;

  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const response = await axios.post(
        url,
        "data=" + encodeURIComponent(query),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 35000, // 35 s — slightly longer than the Overpass [timeout:25/60]
        }
      );

      // Return only the elements array to keep the payload lean
      return res.json({ elements: response.data.elements ?? [] });
    } catch (err) {
      console.warn(`[OSM Proxy] Endpoint failed (${url}):`, err.message);
      lastError = err;
      // Try the next endpoint
    }
  }

  console.error("[OSM Proxy] All Overpass endpoints failed:", lastError?.message);
  res.status(502).json({
    message: "All Overpass endpoints failed. Please try again later.",
    detail: lastError?.message,
  });
};

module.exports = { proxyOverpass };
