const express = require("express");
const cors = require("cors");
const compression = require("compression");

const pharmacyRoutes = require("./routes/pharmacyRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const osmRoutes = require("./routes/osmRoutes");

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());

app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/osm", osmRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "PharmaMap API Running 🚀",
  });
});

// Keep-alive ping — يرد فوراً بـ 200 عشان يصحّي الـ server من الـ cold start
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", ts: Date.now() });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});