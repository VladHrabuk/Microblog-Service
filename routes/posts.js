const express = require('express');
const router = express.Router();
const { getPostById, getAllComments, getUsername } = require('../controllers/postController');

router.get('/posts/:postId', async (req, res, next) => {
  const { userId = -1 } = req._auth;
  const postId = req.params.postId;
  const post = await getPostById(postId);
  const comments = await getAllComments(postId);
  let accountUsername = {};
  if (userId !== -1) {
    accountUsername = await getUsername(userId);
  }
  const locals = { pageTitle: 'Post', post, comments, userId, accountUsername };
  res.render('post_details', { locals });
});

module.exports = {
  router,
};
