const OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter";
export async function getEgyptPharmacies() {
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

  return data.elements;
}

// Fetch pharmacies near a specific location within a given radius (meters)
export async function getNearbyPharmacies(lat, lon, radiusMeters = 3000) {
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
  return data.elements;
}