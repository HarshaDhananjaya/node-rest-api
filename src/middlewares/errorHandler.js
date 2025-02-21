const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.statusCode || 500).json({
    code: err.code || 1500, // Default to INTERNAL_SERVER_ERROR code
    message: err.message || "Internal Server Error",
    attribute: err.attribute || null, // Specific field causing error
  });
};

module.exports = errorHandler;
