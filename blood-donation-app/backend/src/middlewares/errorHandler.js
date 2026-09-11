/**
 * Centralized Application Error Handling Middleware
 */

const errorHandler = (err, req, res, next) => {
  // Catch body-parser JSON syntax error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body.'
    });
  }

  // Operational / application-specific errors
  const statusCode = err.statusCode || (err.status && typeof err.status === 'number' ? err.status : 500);
  const message = err.message || 'An unexpected internal server error occurred.';

  // Log error if 500
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] Server Error [${req.method} ${req.originalUrl}]:`, err);
  }

  const response = {
    success: false,
    message
  };

  if (err.errors && Array.isArray(err.errors)) {
    response.errors = err.errors;
  }

  if (err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
