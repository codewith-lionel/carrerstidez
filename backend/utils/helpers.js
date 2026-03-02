const getPaginationMeta = (total, page, limit) => ({
  total,
  page: Number(page),
  pages: Math.ceil(total / Number(limit)),
  limit: Number(limit),
  hasNext: Number(page) < Math.ceil(total / Number(limit)),
  hasPrev: Number(page) > 1,
});

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => {
  const { password, refreshToken, ...sanitized } = user.toObject ? user.toObject() : user;
  return sanitized;
};

module.exports = { getPaginationMeta, createError, sanitizeUser };
