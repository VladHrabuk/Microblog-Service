const { issueJwt, verifyJwt } = require('../utils/auth');
const postController = require('../controllers/postController');

function jwtParser(req, res, next) {
  const { token = '' } = req.cookies;
  const payload = verifyJwt(token);
  req._auth = payload;
  next();
}

function protectedRoute(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.redirect('/sign-in');
  }
  next();
}

function tokenSession(req, res, next) {
  const { userId } = req._auth || {};
  if (!userId) {
    return next('Authorizarion error');
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

module.exports = {
  getAccountUsername,
};

module.exports = { jwtParser, protectedRoute, tokenSession, getAccountUsername };
