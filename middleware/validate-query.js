/**
 * validates joi schema
 * @param {JoiObject} schema -your validation schema
 * @returns {NextFunction} the next middle ware function
 */
const validateQuery = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.query);
  if (error) {
    return next(error);
  }
  next();
};
module.exports = validateQuery;
