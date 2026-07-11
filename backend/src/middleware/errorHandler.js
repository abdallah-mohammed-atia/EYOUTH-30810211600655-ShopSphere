/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Validation error.',
      errors: err.errors ? err.errors.map((e) => e.message) : [err.message],
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error.',
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
}

module.exports = { errorHandler, notFoundHandler };
