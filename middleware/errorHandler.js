const ApiError = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).render('all', { message: err.message, status: err.status, layout: false });
  } else {
    const error = ApiError.internalServerError();
    return res.status(error.status).render('all', { message: error.message, status: error.status, layout: false });
  }
};
