const express = require("express");
const { proxyOverpass } = require("../controllers/osmController");

const router = express.Router();

// POST /api/osm  — body: { query: "<overpass QL string>" }
router.post("/", proxyOverpass);

module.exports = router;
