/**
 * Standardized API Response Utilities
 */

const success = (res, message = 'Operation successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
};

const created = (res, message = 'Resource created successfully', data = {}) => {
  return success(res, message, data, 201);
};

const error = (res, message = 'An error occurred', statusCode = 400, details = null) => {
  const payload = {
    success: false,
    message
  };

  if (details) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
};

const paginated = (res, items = [], page = 1, limit = 20, total = null) => {
  const totalCount = total !== null ? total : items.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return res.status(200).json({
    success: true,
    count: items.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    items
  });
};

module.exports = {
  success,
  created,
  error,
  paginated
};
