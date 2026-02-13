module.exports = function requireFields(fields) {
  return function validate(req, res, next) {
    const missing = fields.filter((field) => {
      const value = req.body?.[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Missing required fields",
          fields: missing
        }
      });
    }

    return next();
  };
};
