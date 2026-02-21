/**
 * validates joi schema
 * @param {JoiObject} schema -your validation schema
 * @returns {NextFunction} the next middle ware function
 */
const validateRequest = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body);
  if (error) {
<<<<<<< HEAD
    error.isJoi = true;
    return next(error);
=======
    next(error);
>>>>>>> 236e408751329726f379e4d696908f316837c4ec
  }
  next();
};
module.exports = validateRequest;
