const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// Define the log file transport (daily rotating logs)
const transport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m", // Max file size 10MB
  maxFiles: "14d", // Keep logs for 14 days
  zippedArchive: true, // Compress old logs
});

// Redact sensitive fields like password, token, apiKey
const redactedFields = ["password", "token", "apiKey"];

// Mask sensitive data in logs
const maskSensitiveFields = winston.format((info) => {
  if (typeof info.message === "object") {
    redactedFields.forEach((field) => {
      if (info.message[field]) {
        info.message[field] = "******"; // Mask sensitive fields
      }
    });
  }
  return info;
});

// Winston logger configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    maskSensitiveFields(), // Redact sensitive fields
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.metadata({ fillExcept: ["timestamp", "level", "message"] }), // Include metadata automatically
    winston.format.printf(({ timestamp, level, message, metadata }) => {
      const { ip = "N/A", uuid = "N/A", duration = "N/A", method = "N/A", endpoint = "N/A" } = metadata.metadata || {};
      return `${timestamp} | | ${level} | ${ip} | ${uuid} | ${duration}ms | ${method} | ${endpoint} | ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Console logging
    transport, // File transport
  ],
});

// Helper to log with consistent metadata from the request
const logWithRequestMetadata = (req, message) => {
  console.log(req.logMetadata);
  logger.info(message, {
    metadata: req.logMetadata, // Attach the request's logMetadata
  });
};

module.exports = { logger, logWithRequestMetadata };
