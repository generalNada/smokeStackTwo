const express = require("express");
const router = express.Router();
const {
  getAllStrains,
  getStrainById,
  createStrain,
  updateStrain,
  deleteStrain,
} = require("../controllers/strainController");

// GET /api/strains - Get all strains
router.get("/", getAllStrains);

// GET /api/strains/:id - Get strain by ID
router.get("/:id", getStrainById);

// POST /api/strains - Create new strain
router.post("/", createStrain);

// PUT /api/strains/:id - Update strain
router.put("/:id", updateStrain);

// DELETE /api/strains/:id - Delete strain
router.delete("/:id", deleteStrain);

module.exports = router;
