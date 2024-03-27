const { issueJwt, verifyJwt } = require('../utils/auth');

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

module.exports = { jwtParser, protectedRoute, tokenSession };
