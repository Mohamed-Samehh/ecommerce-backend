/**
 * validates joi schema
 * @param {JoiObject} schema -your validation schema
 * @returns {NextFunction} the next middle ware function
 */
const validateRequest = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body);
  if (error) {
    next(error);
  }
  return next();
};

module.exports = validateRequest;
