module.exports = function logger(req, res, next) {
  if (process.env.NODE_ENV !== "production") {
    const timestamp = new Date().toISOString();
    const start = Date.now();
    const method = req.method;
    const url = req.originalUrl;

    res.on("finish", () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      console.log(`[${timestamp}] ${method} ${url} - ${status} (${duration}ms)`);
    });
  }

  next();
};
