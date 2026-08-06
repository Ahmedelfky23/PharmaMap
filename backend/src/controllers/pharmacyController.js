const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
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
module.exports = {
  getAllPharmacies,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
};