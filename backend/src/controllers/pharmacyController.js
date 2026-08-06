const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Pre-warm the DB connection on startup so the first real request is fast
prisma.$connect().catch((err) => console.error("Prisma connect error:", err));

// No in-memory cache used as we now fetch based on map bounds

const getAllPharmacies = async (req, res) => {
  try {
    const { north, south, east, west, search } = req.query;

    let whereClause = {};

    // Map bounds filtering
    if (north && south && east && west) {
      whereClause = {
        latitude: {
          lte: parseFloat(north),
          gte: parseFloat(south),
        },
        longitude: {
          lte: parseFloat(east),
          gte: parseFloat(west),
        },
      };
    }

    // Search filtering
    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const pharmacies = await prisma.pharmacy.findMany({
      where: whereClause,
      orderBy: {
        id: "desc",
      },
    });

    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createPharmacy = async (req, res) => {
  try {
    const pharmacy = await prisma.pharmacy.create({
      data: req.body,
    });

    res.status(201).json(pharmacy);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await prisma.pharmacy.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePharmacy = async (req, res) => {
  try {
    await prisma.pharmacy.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, radius = 3000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    // Since Prisma doesn't support geospatial queries out of the box without PostGIS extension and raw queries,
    // and setting up PostGIS requires database modifications that might not be available on all managed databases,
    // we use a simple bounding box to filter the database first, then (optionally) calculate exact distance in JS.
    
    // 1 degree latitude is approx 111km.
    // 1 degree longitude is approx 111km * cos(latitude).
    const radiusInDegreesLat = radius / 111000;
    const radiusInDegreesLng = radius / (111000 * Math.cos(parseFloat(lat) * (Math.PI / 180)));

    const north = parseFloat(lat) + radiusInDegreesLat;
    const south = parseFloat(lat) - radiusInDegreesLat;
    const east = parseFloat(lng) + radiusInDegreesLng;
    const west = parseFloat(lng) - radiusInDegreesLng;

    const pharmacies = await prisma.pharmacy.findMany({
      where: {
        latitude: {
          lte: north,
          gte: south,
        },
        longitude: {
          lte: east,
          gte: west,
        },
      },
    });

    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllPharmacies,
  getNearbyPharmacies,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
};