const express = require("express");
const cors = require("cors");

const pharmacyRoutes = require("./routes/pharmacyRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "PharmaMap API Running 🚀",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});