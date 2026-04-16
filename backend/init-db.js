const fs = require("fs");
const path = require("path");
const pool = require("./config/db");

async function init() {
  try {
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schema);
    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Error initializing db:", err);
  } finally {
    pool.end();
  }
}

init();
