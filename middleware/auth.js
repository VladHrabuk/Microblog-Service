const { issueJwt, verifyJwt } = require('../utils/auth');
const postController = require('../controllers/postController');
const ApiError = require('../exceptions/api-error');

async function jwtParser(req, res, next) {
  const { token = '' } = req.cookies;
  try {
    const payload = verifyJwt(token);
    req._auth = payload;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.redirect('/sign-in');
  }
}

function protectedRoute(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).redirect('/sign-in');
  }
  next();
}

function tokenSession(req, res, next) {
  const { userId } = req._auth || {};
  if (!userId) {
    return next(ApiError.unauthorizedError);
  }

  const token = issueJwt({ userId });
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
  return res.redirect('/home');
}

async function getAccountUsername(req, res, next) {
  const { userId = -1 } = req._auth;
  let accountUsername = {};
  if (userId !== -1) {
    accountUsername = await postController.getUsername(userId);
  }
  req.locals = { accountUsername };
  next();
}

module.exports = { jwtParser, protectedRoute, tokenSession, getAccountUsername };
