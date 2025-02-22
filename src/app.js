const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const initializeDatabase = require("./config/db"); // Import the async database initialization function
const userRoutes = require("./routes/userRoutes");
const CustomError = require("./utils/customError");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ✅ Middleware (Runs Before Routes)
app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(morgan("dev"));

// ✅ Database Connection
async function runMigrations() {
  try {
    // Get the sequelize instance after the promise resolves
    const sequelize = await initializeDatabase(); // Await the promise to resolve

    console.log("✅ Database connection established.");

    // Sync models
    await sequelize.sync(); // Ensure this is awaited before starting the server
    console.log("✅ Models synchronized.");

    // Start server
    app.listen(5000, () => {
      console.log("🚀 Server started on port 5000");
    });
  } catch (error) {
    console.error("❌ Error during migrations:", error);
    process.exit(1); // Exit if there are errors
  }
}

runMigrations();

// ✅ API Routes
app.use("/api/users", userRoutes);

// ✅ Handle Undefined Routes (404) - MUST BE AFTER ROUTES
app.use((req, res, next) => {
  next(new CustomError("ROUTE_NOT_FOUND"));
});

// ✅ Global Error Handler - MUST BE LAST
app.use(errorHandler);

module.exports = app;
