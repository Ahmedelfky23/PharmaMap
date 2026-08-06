const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
];

async function fetchEgyptPharmacies() {
  const query = `
    [out:json][timeout:300];
    area["ISO3166-1"="EG"][admin_level=2]->.egypt;
    (
      node["amenity"="pharmacy"](area.egypt);
      way["amenity"="pharmacy"](area.egypt);
      relation["amenity"="pharmacy"](area.egypt);
    );
    out center tags;
  `;

  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    console.log(`\n[Import] Attempting to fetch from Overpass API: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "PharmaMap-Egypt-Importer/1.0 (Ahmedelfky23/PharmaMap)",
        },
        body: "data=" + encodeURIComponent(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[Import] Successfully fetched data from ${endpoint}`);
      return data.elements;
    } catch (err) {
      console.error(`[Import] Fetch failed for ${endpoint}`);
      console.error(err);
      lastError = err;
      // loop to next endpoint
    }
  }

  throw new Error(`All Overpass endpoints failed. Last error: ${lastError?.message || lastError}`);
}

async function importPharmacies() {
  try {
    const elements = await fetchEgyptPharmacies();
    console.log(`Found ${elements.length} pharmacies in Egypt.`);

    let inserted = 0;
    let updated = 0;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const tags = element.tags || {};
      
      const osmId = element.type + "/" + element.id;
      const name = tags.name || tags["name:en"] || tags["name:ar"] || "صيدلية غير معروفة";
      const lat = element.lat ?? element.center?.lat;
      const lon = element.lon ?? element.center?.lon;

      if (!lat || !lon) continue;

      const data = {
        name: name,
        chain: tags.brand || null,
        address: [tags["addr:city"], tags["addr:street"]].filter(Boolean).join(", ") || null,
        phone: tags.phone || tags["contact:phone"] || null,
        email: tags.email || null,
        website: tags.website || null,
        openingHours: tags.opening_hours || null,
        latitude: lat,
        longitude: lon,
        osmId: osmId,
        source: "osm",
      };

      try {
        const existing = await prisma.pharmacy.findUnique({
          where: { osmId: osmId },
        });

        if (existing) {
          await prisma.pharmacy.update({
            where: { id: existing.id },
            data: data,
          });
          updated++;
        } else {
          await prisma.pharmacy.create({
            data: data,
          });
          inserted++;
        }
      } catch (err) {
        console.error(`Error saving pharmacy ${osmId}:`, err.message);
      }

      if ((i + 1) % 500 === 0) {
        console.log(`Processed ${i + 1}/${elements.length}...`);
      }
    }

    console.log(`Import completed successfully! Inserted: ${inserted}, Updated: ${updated}`);
  } catch (err) {
    console.error("Import failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importPharmacies();
}

module.exports = { importPharmacies };
