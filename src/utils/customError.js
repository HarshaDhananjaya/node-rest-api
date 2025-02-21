const ERROR_CODES = require("../constants/errorCodes");

class CustomError extends Error {
  constructor(errorKey, attribute = null) {
    const error = ERROR_CODES[errorKey] || ERROR_CODES.INTERNAL_SERVER_ERROR;
    super(error.message);
    this.code = error.code;
    this.statusCode = error.status;
    this.attribute = attribute;
  }
}

module.exports = CustomError;
