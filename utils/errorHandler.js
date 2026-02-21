/**
 * Error Handlers Registry
 *
 * To add a new error handler, append an object to the array below.
 * Each object must have two properties:
 *
 * @property {Function} match - receives the error object, returns true if this handler should handle it
 * @property {Function} handler - receives the error object, returns { statusCode, status, message/errors }
 *
 * @example
 * {
 *   match: (err) => err.name === 'YourErrorName',
 *   handler: (err) => ({
 *     statusCode: 400,
 *     status: 'fail',
 *     message: 'Your error message'
 *   })
 * }
 *
 */
module.exports = [
  {
    match: (err) => err.name === 'ValidationError' && err.errors, // mongoose errors
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: Object.values(err.errors).map((e) => e.message)
    })
  },
  {
    match: (err) => err.code === 11000,
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: `${Object.keys(err.keyValue)[0]} already exists`
    })
  },
  {
    match: (err) => err.name === 'ValidationError' && err.isJoi, // joi errors
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: Object.values(err.details).map((e) => e.message)
    })
  },
  {
    match: (err) => err.name === 'BookNotFoundError',
    handler: (err) => ({
      statusCode: 404,
      status: 'Fail',
      errors: err.message
    })
  }
];
