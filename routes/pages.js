const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const locals = { pageTitle: 'Home' };
  res.render('index', { locals });
});

module.exports = {
  router,
};
