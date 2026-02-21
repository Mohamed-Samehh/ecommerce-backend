const validateRequest = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body);
  if (error) {
    next(error);
  }
  return next();
};

module.exports = validateRequest;
