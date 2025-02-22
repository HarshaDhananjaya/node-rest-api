require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const initializeDatabase = require("./config/db"); // Ensure DB is ready before starting
const userRoutes = require("./routes/userRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ✅ Database Initialization & Migrations
async function startServer() {
  try {
    // Step 1️⃣: Ensure database exists & get Sequelize instance
    const sequelize = await initializeDatabase();

    // Step 2️⃣: Run migrations before starting server
    await sequelize.sync(); // If using Sequelize CLI migrations, use `npx sequelize db:migrate`
    console.log("✅ Database synchronized.");

    // Step 3️⃣: Start the Express server
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
