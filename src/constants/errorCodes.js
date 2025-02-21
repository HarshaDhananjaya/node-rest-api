const ERROR_CODES = {
  FIELD_VALIDATION: { code: 1001, message: "API object field validation error", status: 400 },
  INVALID_INPUT: { code: 1200, message: "Invalid input", status: 400 },
  MISSING_MANDATORY_FIELD: { code: 1201, message: "Missing mandatory field", status: 400 },
  USER_NOT_FOUND: { code: 1404, message: "User not found", status: 404 },
  ROUTE_NOT_FOUND: { code: 404, message: "Route not found", status: 404 }, // ✅ Added Route Not Found
  INTERNAL_SERVER_ERROR: { code: 1500, message: "Internal server error", status: 500 },
};

module.exports = ERROR_CODES;
