const process = require('node:process');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('No token provided');
    err.name = 'UnauthorizedError';
    return next(err);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const authErr = new Error('Invalid token');
    authErr.name = 'UnauthorizedError';
    return next(authErr);
  }
};
