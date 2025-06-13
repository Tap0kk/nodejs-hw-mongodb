const errorHandler = (err, req, res, next) => {
  const status = typeof err.status === 'number' ? err.status : 500;
  const message = typeof err.message === 'string' ? err.message : 'Something went wrong';

  res.status(status).json({
    status,
    message,
    data: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

export default errorHandler;
