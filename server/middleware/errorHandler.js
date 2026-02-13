module.exports = function errorHandler(err, req, res, next) {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid JSON payload"
      }
    });
  }

  const status = err?.status || 500;
  return res.status(status).json({
    success: false,
    error: {
      message: err?.message || "Internal Server Error"
    }
  });
};
