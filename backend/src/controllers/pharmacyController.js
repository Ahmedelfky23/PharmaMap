const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Pre-warm the DB connection on startup so the first real request is fast
prisma.$connect().catch((err) => console.error("Prisma connect error:", err));

// In-memory cache — avoids hitting Postgres on every GET request.
// Invalidated on every mutation so data is always fresh after changes.
let pharmacyCache = null;

function clearCache() {
  pharmacyCache = null;
}

const getAllPharmacies = async (req, res) => {
  try {
    // Serve from in-memory cache if available (cache is cleared on any mutation)
    if (pharmacyCache) {
      return res.json(pharmacyCache);
    }

    const pharmacies = await prisma.pharmacy.findMany({
      orderBy: {
        id: "desc",
      },
    });

    pharmacyCache = pharmacies;
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

    clearCache(); // Next GET will re-fetch fresh data from DB
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

    clearCache(); // Next GET will re-fetch fresh data from DB
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

    clearCache(); // Next GET will re-fetch fresh data from DB
    res.json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getAllPharmacies,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
};