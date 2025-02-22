require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const initializeDatabase = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const runMigrations = require("./../run-migrations"); // Import the migration script
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

async function startServer() {
  try {
    console.log("⏳ Ensuring database is created...");
    await initializeDatabase(); // ✅ Step 1: Create database
    await runMigrations(); // ✅ Step 2: Run migrations

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// ✅ API Routes
app.use("/api/users", userRoutes);

module.exports = app;
