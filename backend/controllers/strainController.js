const { queries, generateId, rowToStrain } = require("../db");

// GET all strains
const getAllStrains = (req, res) => {
  try {
    const rows = queries.getAll.all();
    const strains = rows.map(rowToStrain);
    res.json(strains);
  } catch (error) {
    console.error("Error fetching strains:", error);
    res.status(500).json({ error: "Failed to fetch strains" });
  }
};

// GET strain by ID
const getStrainById = (req, res) => {
  try {
    const { id } = req.params;
    const row = queries.getById.get(id, id);

    if (!row) {
      return res.status(404).json({ error: "Strain not found" });
    }

    const strain = rowToStrain(row);
    res.json(strain);
  } catch (error) {
    console.error("Error fetching strain:", error);
    res.status(500).json({ error: "Failed to fetch strain" });
  }
};

// POST create new strain
const createStrain = (req, res) => {
  try {
    const {
      name,
      type,
      source = "",
      image = "",
      setting = "",
      format = "",
      stoner = "",
      impressions = "",
      other = "",
    } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    // Generate _id (MongoDB-style)
    const _id = generateId();
    // Use _id as id for consistency, but allow override
    const id = req.body.id || _id;

    // Insert into database
    queries.create.run(
      _id,
      id,
      name,
      type,
      source,
      image,
      setting,
      format,
      stoner,
      impressions,
      other
    );

    // Fetch the created strain
    const row = queries.getById.get(_id, _id);
    const strain = rowToStrain(row);

    res.status(201).json(strain);
  } catch (error) {
    console.error("Error creating strain:", error);
    if (error.code === "SQLITE_CONSTRAINT") {
      return res
        .status(400)
        .json({ error: "Strain with this ID already exists" });
    }
    res.status(500).json({ error: "Failed to create strain" });
  }
};

// PUT update strain
const updateStrain = (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      source,
      image,
      setting,
      format,
      stoner,
      impressions,
      other,
    } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    // Check if strain exists
    const existing = queries.getById.get(id, id);
    if (!existing) {
      return res.status(404).json({ error: "Strain not found" });
    }

    // Update the strain
    const result = queries.update.run(
      name,
      type,
      source || "",
      image || "",
      setting || "",
      format || "",
      stoner || "",
      impressions || "",
      other || "",
      id,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Strain not found" });
    }

    // Fetch the updated strain
    const row = queries.getById.get(id, id);
    const strain = rowToStrain(row);

    res.json(strain);
  } catch (error) {
    console.error("Error updating strain:", error);
    res.status(500).json({ error: "Failed to update strain" });
  }
};

// DELETE strain
const deleteStrain = (req, res) => {
  try {
    const { id } = req.params;

    // Check if strain exists
    const existing = queries.getById.get(id, id);
    if (!existing) {
      return res.status(404).json({ error: "Strain not found" });
    }

    // Delete the strain
    const result = queries.delete.run(id, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Strain not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting strain:", error);
    res.status(500).json({ error: "Failed to delete strain" });
  }
};

module.exports = {
  getAllStrains,
  getStrainById,
  createStrain,
  updateStrain,
  deleteStrain,
};
