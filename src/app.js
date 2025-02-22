require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const initializeDatabase = require("./config/db");
const { exec } = require("child_process");
const userRoutes = require("./routes/userRoutes");
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

async function startServer() {
  try {
    console.log("⏳ Ensuring database is created...");
    const sequelize = await initializeDatabase(); // ✅ Step 1: Create database

    console.log("⏳ Running migrations...");
    exec("npx sequelize db:migrate", async (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Migration error: ${error.message}`);
        process.exit(1);
      }
      if (stderr) console.error(`⚠️ Migration warning: ${stderr}`);
      console.log(stdout);

      console.log("✅ Migrations completed. Starting server...");
      app.listen(5000, () => {
        console.log("🚀 Server running on port 5000");
      });
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
