const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Get database path from environment or use default
const dbPath =
  process.env.DB_PATH || path.join(__dirname, "data", "strains.db");

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database connection
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better concurrency
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create strains table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS strains (
    _id TEXT PRIMARY KEY,
    id TEXT UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    source TEXT,
    image TEXT,
    setting TEXT,
    format TEXT,
    stoner TEXT,
    impressions TEXT,
    other TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createTableQuery);

// Helper function to generate MongoDB-style _id
function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  );
}

// Helper to convert row to strain object (with both id and _id)
function rowToStrain(row) {
  return {
    _id: row._id,
    id: row.id || row._id, // Use id if exists, otherwise _id
    name: row.name,
    type: row.type,
    source: row.source || "",
    image: row.image || "",
    setting: row.setting || "",
    format: row.format || "",
    stoner: row.stoner || "",
    impressions: row.impressions || "",
    other: row.other || "",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Prepare statements for better performance
const queries = {
  getAll: db.prepare("SELECT * FROM strains ORDER BY created_at DESC"),
  getById: db.prepare("SELECT * FROM strains WHERE _id = ? OR id = ?"),
  create: db.prepare(`
    INSERT INTO strains (_id, id, name, type, source, image, setting, format, stoner, impressions, other)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE strains 
    SET name = ?, type = ?, source = ?, image = ?, setting = ?, format = ?, stoner = ?, impressions = ?, other = ?, updated_at = CURRENT_TIMESTAMP
    WHERE _id = ? OR id = ?
  `),
  delete: db.prepare("DELETE FROM strains WHERE _id = ? OR id = ?"),
};

module.exports = {
  db,
  queries,
  generateId,
  rowToStrain,
};
