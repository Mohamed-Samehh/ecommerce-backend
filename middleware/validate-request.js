const validateRequest = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body);
  if (error) {
    error.isJoi = true;
    return next(error);
  }
  next();
};
module.exports = validateRequest;
