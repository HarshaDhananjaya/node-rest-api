require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const CustomError = require("./utils/customError");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// API Routes
app.use("/api/users", userRoutes);

// Handle Undefined Routes (404) - MUST BE AFTER ROUTES
app.use((req, res, next) => {
  next(new CustomError("ROUTE_NOT_FOUND"));
});

// Global Error Handler - MUST BE LAST
app.use(errorHandler);

module.exports = app; // Export app (No server logic here)
