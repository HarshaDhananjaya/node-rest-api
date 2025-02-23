// Require dotenv to load environment variables from .env file
require("dotenv").config();

// Dependencies
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes
const userRoutes = require("./routes/userRoutes");
const CustomError = require("./utils/customError");
const errorHandler = require("./middlewares/errorHandler");
const { logWithRequestMetadata } = require("./logger");

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Middleware for logging requests
app.use((req, res, next) => {
  const start = Date.now(); // Track request start time
  const uuid = req.headers["x-request-id"] || "N/A"; // Get UUID from header (fallback to N/A)

  // Attach metadata to the request object
  req.logMetadata = {
    ip: req.ip || "N/A",
    uuid: uuid,
    method: req.method,
    endpoint: req.originalUrl,
    startTime: start, // Store the request start time
  };

  // Handle the 'finish' event when the response has been sent
  res.on("finish", () => {
    const duration = Date.now() - start; // Calculate the request duration
    req.logMetadata.duration = `${duration}`; // Add duration to metadata

    // Use the helper to log the metadata
    logWithRequestMetadata(req, "Request processed");
  });

  next(); // Pass control to the next middleware or route handler
});

// API Routes
app.use("/api/users", userRoutes);

// Handle Undefined Routes (404) - MUST BE AFTER ROUTES
app.use((req, res, next) => {
  next(new CustomError("ROUTE_NOT_FOUND"));
});

// Global Error Handler - MUST BE LAST
app.use(errorHandler);

module.exports = app; // Export app (No server logic here)
