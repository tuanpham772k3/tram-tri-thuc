const { sendError, AppError } = require("../utils/helper");

const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, "Validation failed", 422, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return sendError(res, `${field} already exists`, 409);
  }

  if (err.name === "CastError") {
    return sendError(res, "Invalid ID format", 400);
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  return sendError(res, err.message || "Internal server error", 500);
};

const notFoundHandler = (_req, res) => {
  sendError(res, "Route not found", 404);
};

module.exports = { errorHandler, notFoundHandler };
