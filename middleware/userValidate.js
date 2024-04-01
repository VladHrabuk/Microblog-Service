const { check, validationResult } = require('express-validator');
const { findUser } = require('../controllers/userController');
const ApiError = require('../exceptions/api-error');

const SignInErrorHandler = (error, _req, res, _next) => {
  return res.render('sign_in', { pageTitle: 'Sign in', error, layout: false });
};

const validateSignUpForm = [
  check('username').notEmpty().withMessage('Username should be at least 3 characters long!'),
  check('name').notEmpty().withMessage('Name is required field!'),
  check('password').isLength({ min: 4 }).withMessage('Password should be at least 4 characters long!'),
  check('username').custom(async (value) => {
    const user = await findUser({ username: value });
    if (user) {
      throw ApiError.badRequest('Such username already exists!');
    }
    return true;
  }),
  check('password_repeat').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw ApiError.badRequest("Passwords don't match!");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.locals.formData = req.body;
      res.render('sign_up', { pageTitle: 'Sign Up', errors: errors.mapped(), layout: false });
    } else {
      next();
    }
  },
];

module.exports = {
  validateSignUpForm,
  SignInErrorHandler,
};
