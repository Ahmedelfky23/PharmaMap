const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Get reviews for a specific pharmacy
router.get("/:pharmacyId", async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { pharmacyId },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Add a review for a specific pharmacy
router.post("/:pharmacyId", async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { rating, text } = req.body;
    
    if (!rating || !text) {
      return res.status(400).json({ error: "Rating and text are required" });
    }

    const review = await prisma.review.create({
      data: {
        pharmacyId,
        rating: parseInt(rating),
        text,
      },
    });
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add review" });
  }
});

module.exports = router;
