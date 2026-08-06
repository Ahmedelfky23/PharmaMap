const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
export async function getEgyptPharmacies() {
  const query = `
[out:json][timeout:60];

area["ISO3166-1"="EG"][admin_level=2]->.egypt;

nwr["amenity"="pharmacy"](area.egypt);

out center tags qt;
`;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "data=" + encodeURIComponent(query),
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
nwr["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
out center tags qt;
`;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "data=" + encodeURIComponent(query),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch nearby pharmacies.");
  }

  const data = await response.json();
  return data.elements;
}