/**
 * Seed script to populate the database with initial data
 * Usage: node seed.js [path/to/strains.json]
 */

require("dotenv").config();
const { db, queries, generateId, rowToStrain } = require("./db");
const fs = require("fs");
const path = require("path");

// Get strains.json path from command line or use default
const strainsJsonPath =
  process.argv[2] || path.join(__dirname, "..", "strains.json");

console.log(`🌱 Seeding database from: ${strainsJsonPath}`);

try {
  // Read strains.json
  if (!fs.existsSync(strainsJsonPath)) {
    console.error(`❌ File not found: ${strainsJsonPath}`);
    process.exit(1);
  }

  const strainsData = JSON.parse(fs.readFileSync(strainsJsonPath, "utf8"));
  console.log(`📦 Found ${strainsData.length} strains to import`);

  // Check if database already has data
  const existing = queries.getAll.all();
  if (existing.length > 0) {
    console.log(`⚠️  Database already contains ${existing.length} strains.`);
    console.log(`   Clear the database first if you want to re-seed.`);
    console.log(`   Or use: DELETE FROM strains;`);
    process.exit(1);
  }

  // Insert each strain
  let imported = 0;
  let skipped = 0;

  for (const strain of strainsData) {
    try {
      const _id = generateId();
      const id = strain.id ? String(strain.id) : _id;

      queries.create.run(
        _id,
        id,
        strain.name || "",
        strain.type || "",
        strain.source || "",
        strain.image || "",
        strain.setting || "",
        strain.format || "",
        strain.stoner || "",
        strain.impressions || "",
        strain.other || ""
      );

      imported++;
      console.log(`✅ Imported: ${strain.name}`);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT") {
        console.log(`⏭️  Skipped (duplicate): ${strain.name}`);
        skipped++;
      } else {
        console.error(`❌ Error importing ${strain.name}:`, error.message);
      }
    }
  }

  console.log(`\n✨ Seeding complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total in database: ${queries.getAll.all().length}`);

  db.close();
} catch (error) {
  console.error("❌ Error seeding database:", error);
  db.close();
  process.exit(1);
}
