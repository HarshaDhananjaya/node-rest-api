require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
const CustomError = require("./utils/customError");

const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging

// ✅ Database Connection & Server Initialization
const PORT = process.env.PORT || 5000;

db.sync()
  .then(() => {
    console.log("✅ Database synced successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// ✅ Routes
app.use("/api/users", userRoutes);

// ✅ Handle Undefined Routes (404)
app.use((req, res, next) => {
  next(new CustomError("ROUTE_NOT_FOUND"));
});

// ✅ Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
