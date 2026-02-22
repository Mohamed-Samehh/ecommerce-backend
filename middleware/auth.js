const process = require('node:process');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization; // look for embedded metadata(header)
  if (!authHeader || !authHeader.startsWith('Bearer ')) { // Bearer => tell to server (i've JWT token)
    return res.status(401).json({message: 'No token provided'});
  }
  const token = authHeader.split(' ')[1]; // token after 'Bearer '
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // check validity of token
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({message: 'Invalid token'});
  }
};
