const crypto = require('crypto');

function generateSecret(len = 64) {
  return crypto.randomBytes(len).toString('hex');
}

console.log(generateSecret());
