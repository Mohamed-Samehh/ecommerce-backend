module.exports = function (req, res, next) {
  if (!req.user || !Array.isArray(req.user.roles) || !req.user.roles.includes('admin')) {
    const err = new Error('Admin access required');
    err.name = 'ForbiddenError';
    return next(err);
  }
  next();
};
