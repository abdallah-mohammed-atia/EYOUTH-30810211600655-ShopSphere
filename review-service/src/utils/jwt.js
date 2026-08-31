const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

if (!SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production environment variables');
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { verifyToken };
