const express = require("express");

const {
  getAllPharmacies,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
} = require("../controllers/pharmacyController");

const router = express.Router();

router.get("/", getAllPharmacies);

router.post("/", createPharmacy);

router.put("/:id", updatePharmacy);

router.delete("/:id", deletePharmacy);

module.exports = router;