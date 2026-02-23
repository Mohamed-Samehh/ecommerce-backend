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
    match: (err) => err.name === 'ValidationError' && err.errors,
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: Object.values(err.errors).map((e) => {
        if (e.name === 'CastError') {
          return `Invalid ${e.path}: expected ${e.kind}, got ${typeof e.value}`;
        }
        return e.message;
      })
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
    match: (err) => err.name === 'CastError', // error for wrong objID
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: `"Invalid ${err.path}: ${err.value}"`
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
  },
  {
    match: (err) => err.name === 'AuthorNotFoundError',
    handler: (err) => ({
      statusCode: 404,
      status: 'Fail',
      errors: err.message
    })
  },
  {
    match: (err) => err.name === 'NoImageUploaded',
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: err.message
    })
  },
  {
    match: (err) => err.name === 'InvalidFileType',
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: err.message
    })
  },
  {
    match: (err) => err.code === 'LIMIT_FILE_SIZE',
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: err.message
    })
  },
  {
    match: (err) => err.name === 'UnauthorizedError',
    handler: (err) => ({
      statusCode: 401,
      status: 'Fail',
      message: err.message
    })
  },
  {
    match: (err) => err.name === 'ForbiddenError',
    handler: (err) => ({
      statusCode: 403,
      status: 'Fail',
      message: err.message
    })
  },
  {
    match: (err) => err.name === 'UserNotFoundError',
    handler: (err) => ({
      statusCode: 404,
      status: 'Fail',
      message: err.message
    })
  },
  {
    match: (err) => err.name === 'CategoryNotFoundError',
    handler: (err) => ({
      statusCode: 404,
      status: 'Fail',
      errors: err.message
    })
  },
  {
    match: (err) => err.name === 'CategoryDeleteError',
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: err.message
    })
  },
  {
    match: (err) => err.name === 'CartNotFoundError',
    handler: (err) => ({
      statusCode: 404,
      status: 'Fail',
      errors: err.message
    })
  },
  {
    match: (err) => err.name === 'BookNotInCartError',
    handler: (err) => ({
      statusCode: 404,
      status: 'Fail',
      errors: err.message
    })
  },
  {
    match: (err) => err.name === 'InsufficientStockError',
    handler: (err) => ({
      statusCode: 400,
      status: 'Fail',
      errors: err.message
    })
  }
];
