const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { AsyncLocalStorage } = require("async_hooks");

// **Global storage for request metadata**
const asyncLocalStorage = new AsyncLocalStorage();

// **Rotating log file transports**
const requestTransport = new DailyRotateFile({
  filename: "logs/requests-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m",
  maxFiles: "14d",
  zippedArchive: true,
});

const activityTransport = new DailyRotateFile({
  filename: "logs/activity-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m",
  maxFiles: "14d",
  zippedArchive: true,
});

// Mask sensitive fields
const redactedFields = ["password", "token", "apiKey"];
const maskSensitiveFields = winston.format((info) => {
  if (typeof info.metadata === "object") {
    redactedFields.forEach((field) => {
      if (info.metadata.body && info.metadata.body[field]) {
        info.metadata.body[field] = "******";
      }
    });
  }
  return info;
});

// **Request-Response Logger Format**
const requestLogFormat = winston.format.printf(({ timestamp, level, message, metadata }) => {
  const {
    ip = "N/A",
    uuid = "N/A",
    duration = "N/A",
    method = "N/A",
    endpoint = "N/A",
    status = "N/A",
    query = {},
    body = {},
    response = "N/A",
  } = metadata || {};
  return `${timestamp} | ${level.toUpperCase()} | ${ip} | ${uuid} | ${duration}ms | ${method} | ${endpoint} | Status: ${status} | Query: ${JSON.stringify(
    query
  )} | Body: ${JSON.stringify(body)} | Response: ${JSON.stringify(response)} | ${message}`;
});

// **Activity Logger Format with Combined Metadata**
const activityLogFormat = winston.format.printf(({ timestamp, level, message, metadata }) => {
  const { ip, uuid, method, endpoint } = metadata?.metadata || {};
  const logPart = `${timestamp} | ${level.toUpperCase()} | ${ip} | ${uuid} | ${method} | ${endpoint}`;
  return `${logPart} | ${message}`;
});

// **Request Logger**
const requestLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    maskSensitiveFields(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.metadata({ fillExcept: ["timestamp", "level", "message"] }),
    requestLogFormat
  ),
  transports: [new winston.transports.Console(), requestTransport],
});

// **Activity Logger**
const activityLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    maskSensitiveFields(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.metadata({ fillExcept: ["timestamp", "level", "message"] }),
    activityLogFormat
  ),
  transports: [new winston.transports.Console(), activityTransport],
});

// **Middleware to attach request metadata using AsyncLocalStorage**
const attachLogMetadata = (req, res, next) => {
  // console.log(req);
  console.log(res);
  const requestMetadata = {
    ip: req.ip || "N/A",
    uuid: req.headers["x-request-id"] || "N/A",
    method: req.method,
    endpoint: req.originalUrl,
    query: req.query,
    body: { ...req.body },
    startTime: Date.now(),
  };

  // Store metadata in AsyncLocalStorage
  asyncLocalStorage.run(requestMetadata, () => {
    res.on("finish", () => {
      requestMetadata.duration = Date.now() - requestMetadata.startTime;
      requestMetadata.status = res.statusCode;
      requestMetadata.response = res.locals.response || "N/A";

      // Automatically log request-response details
      requestLogger.info("Request processed", requestMetadata);
    });

    next();
  });
};

// **Updated logActivity function (No req parameter required)**
const logActivity = (level, message) => {
  const metadata = asyncLocalStorage.getStore() || { warning: "No request metadata available" };

  activityLogger.log({
    level,
    message,
    metadata,
  });
};

module.exports = { requestLogger, activityLogger, attachLogMetadata, logActivity };
