const process = require('node:process');
const jwt = require('jsonwebtoken');

function signToken(user) {
  return jwt.sign(
    {id: user._id, email: user.email, roles: user.roles},
    process.env.JWT_SECRET,
    {expiresIn: '15d'}
  );
}

module.exports = {signToken};
