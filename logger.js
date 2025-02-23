const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const transport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m", // Max file size 10MB
  maxFiles: "14d", // Keep logs for 14 days
  zippedArchive: true, // Compress old logs
});

const redactedFields = ["password", "token", "apiKey"];

// Create custom format to mask sensitive data
const maskSensitiveFields = winston.format((info) => {
  if (typeof info.message === "object") {
    redactedFields.forEach((field) => {
      if (info.message[field]) {
        info.message[field] = "******";
      }
    });
  }
  return info;
});

// Winston logger configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    maskSensitiveFields(), // Redact JSON fields
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [transport],
});

module.exports = logger;
