const express = require('express');
const router = express.Router();
const { findUser, addNewUser } = require('../controllers/userController');
const postController = require('../controllers/postController');
const { hashPassword, checkPassword } = require('../utils/auth');
const { protectedRoute, tokenSession, getAccountUsername } = require('../middleware/auth');
const { SignInErrorHandler, validateSignUpForm } = require('../middleware/userValidate');
const ApiError = require('../exceptions/api-error');

// Authorized/Unauthorized user - main page with all posts
router.get('/home', getAccountUsername, async (req, res, next) => {
  const { userId = -1 } = req._auth;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 10;
  const { posts, totalCount } = await postController.paginationPosts(req, page, limit);
  const totalPages = Math.ceil(totalCount / limit);
  const locals = { pageTitle: 'Travel Blog', userId, posts, ...req.locals, page, limit, totalPages, totalCount };
  if (userId !== -1) {
    res.render('index', { locals }); // Render page for authorized user
  } else {
    res.render('index', { locals }); // Render page for unauthorized user
  }
});

// Authorized user - additional page with user's own posts
router.get('/posts', getAccountUsername, protectedRoute, async (req, res, next) => {
  const { userId = -1 } = req._auth;
  const posts = await postController.getAllPostsByUser(userId);
  const locals = { pageTitle: 'Posts', userId, posts, ...req.locals };
  res.render('index', { locals });
});

// Sign in
router
  .route('/sign-in')
  .get(async (req, res, next) => {
    const locals = { pageTitle: 'Sign In' };
    res.render('sign_in', { locals, layout: false });
  })
  .post(
    async (req, res, next) => {
      const { username, password } = req.body;
      const user = await findUser({ username });
      const formData = { username, password };

      if (!user) {
        const error = ApiError.badRequest('Username not found');
        res.locals.errors = { username: { msg: error.message } };
        res.locals.formData = formData;
        return next();
      }

      const isPassChecked = await checkPassword(password, user.password);
      if (!isPassChecked) {
        const error = ApiError.badRequest('Incorrect password');
        res.locals.errors = { password: { msg: error.message } };
        res.locals.formData = formData;
        return next();
      }

      req._auth = { userId: user.id };
      next();
    },
    tokenSession,
    SignInErrorHandler
  );

// Sign up
router
  .route('/sign-up')
  .get(async (req, res, next) => {
    const locals = { pageTitle: 'Sign Up' };
    res.render('sign_up', { locals, layout: false });
  })
  .post(validateSignUpForm, async (req, res, next) => {
    const { username, name, password } = req.body;
    const hashedPass = await hashPassword(password);
    await addNewUser({ username, name, password: hashedPass });
    res.redirect('/sign-in');
  });

// Sign out
router.get('/sign-out', async (req, res) => {
  res.clearCookie('token');
  res.redirect('/home');
});

module.exports = {
  router,
};
