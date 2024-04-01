const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../exceptions/api-error');

async function hashPassword(plainTextPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(plainTextPassword, salt);
  return hashedPass;
}

async function checkPassword(plainTextPassword, hashedPassword) {
  try {
    return !!(await bcrypt.compare(plainTextPassword, hashedPassword));
  } catch (error) {
    return false;
  }
}

// Generate jwt
function issueJwt(dataToSign) {
  return jwt.sign(dataToSign, process.env.SECRET_JWT, { expiresIn: '2h' });
}

function verifyJwt(token) {
  const data = {};
  if (!token) {
    console.warn('Missing JWT, unauthorized client!');
    return data;
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_JWT);
    return data;
  } catch (error) {
    console.error('Invalid JWT!');
    throw ApiError.unauthorizedError();
  }
}

module.exports = {
  hashPassword,
  checkPassword,
  issueJwt,
  verifyJwt,
};
