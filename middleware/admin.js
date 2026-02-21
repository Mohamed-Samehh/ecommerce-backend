module.exports = function (req, res, next) {
  if (!req.user || !Array.isArray(req.user.roles) || !req.user.roles.includes('admin')) {
    return res.status(403).json({message: 'Admin access required'});
  }
  next();
};
