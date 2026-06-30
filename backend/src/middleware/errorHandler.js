// Global error handler middleware
// This catches any error that occurs in route handlers

export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack:   err.stack,
    url:     req.url,
    method:  req.method,
  });

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    error:   err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const createError = (status, message) => {
  const error  = new Error(message);
  error.status = status;
  return error;
};
