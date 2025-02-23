require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { connectDatabase } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const runMigrations = require("./migrations"); // Import the migration script
const CustomError = require("./utils/customError");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

async function startServer() {
  try {
    console.log("⏳ Ensuring database is created...");
    await connectDatabase(); // Step 1: Create database
    await runMigrations(); // Step 2: Run migrations

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// API Routes
app.use("/api/users", userRoutes);

// Handle Undefined Routes (404) - MUST BE AFTER ROUTES
app.use((req, res, next) => {
  next(new CustomError("ROUTE_NOT_FOUND"));
});

// Global Error Handler - MUST BE LAST
app.use(errorHandler);

module.exports = app;

module.exports = app;
