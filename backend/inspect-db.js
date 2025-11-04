/**
 * Database Inspector Script
 * Usage: node inspect-db.js
 */

require("dotenv").config();
const { db, queries } = require("./db");

console.log("🔍 Inspecting SQLite Database\n");
console.log("=".repeat(50));

try {
  // Get all strains
  const strains = queries.getAll.all();

  console.log(`\n📊 Total Strains in Database: ${strains.length}\n`);

  if (strains.length > 0) {
    console.log("📋 Strain Details:\n");
    strains.forEach((strain, index) => {
      console.log(`${index + 1}. ${strain.name}`);
      console.log(`   Type: ${strain.type}`);
      console.log(`   Source: ${strain.source || "N/A"}`);
      console.log(`   ID: ${strain._id}`);
      console.log(`   Created: ${strain.created_at}`);
      console.log("");
    });

    console.log("=".repeat(50));
    console.log("\n💾 Database File Location:");
    console.log(`   ${process.env.DB_PATH || "./data/strains.db"}`);
    console.log("\n✅ Database is being used as the data source!");
  } else {
    console.log("⚠️  Database is empty. Run: npm run seed");
  }

  db.close();
} catch (error) {
  console.error("❌ Error inspecting database:", error);
  db.close();
  process.exit(1);
}
