const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const query = `
[out:json][timeout:25];
(
  node["amenity"="pharmacy"](around:5000,30.0444,31.2357);
  way["amenity"="pharmacy"](around:5000,30.0444,31.2357);
  relation["amenity"="pharmacy"](around:5000,30.0444,31.2357);
);
out center tags qt;
`;

fetch(OVERPASS_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/plain",
    "User-Agent": "PharmaMap/1.0"
  },
  body: query
})
  .then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error("Failed: " + text);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Found:", data.elements.length);
  })
  .catch(console.error);
