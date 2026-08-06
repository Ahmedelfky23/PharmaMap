const express = require("express");

const {
  getAllPharmacies,
  getNearbyPharmacies,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
} = require("../controllers/pharmacyController");
const { importPharmacies } = require("../../scripts/importOsm");

const router = express.Router();

router.post("/admin/import-osm", (req, res) => {
  const adminSecret = process.env.ADMIN_SECRET;
  const providedSecret = req.headers['x-admin-secret'];
  
  if (!adminSecret || providedSecret !== adminSecret) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fire and forget, don't await because it takes several minutes
  importPharmacies().catch(err => console.error("Import failed:", err));

  res.status(202).json({ message: "Import started in the background. Check server logs for progress." });
});

router.get("/nearby", getNearbyPharmacies);

router.get("/", getAllPharmacies);

router.post("/", createPharmacy);

router.put("/:id", updatePharmacy);

router.delete("/:id", deletePharmacy);

module.exports = router;