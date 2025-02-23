const app = require("./app"); // Import app.js
const { connectDatabase } = require("./config/db");
const runMigrations = require("./migrations");
const logger = require("./logger");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("⏳ Ensuring database is created...");
    await connectDatabase(); // Step 1: Create database
    await runMigrations(); // Step 2: Run migrations

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
