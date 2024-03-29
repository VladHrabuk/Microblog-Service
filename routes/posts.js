const express = require('express');
const router = express.Router();
const { getAccountUsername } = require('../middleware/auth');
const { getPostById, getAllComments, createPost, updatePost, deletePost } = require('../controllers/postController');

router.get('/posts/new', getAccountUsername, async (req, res, next) => {
  const { userId = -1 } = req._auth;
  const locals = { pageTitle: 'New Post', userId, ...req.locals };
  res.render('new_post', { locals });
});

router
  .route('/posts/edit/:postId')
  .get(getAccountUsername, async (req, res, next) => {
    const postId = req.params.postId;
    const post = await getPostById(postId);
    const locals = { pageTitle: 'Edit Post', post, postId, ...req.locals };
    res.render('update_post', { locals });
  })
  .put(async (req, res, next) => {
    const postId = req.params.postId;
    const { title, description } = req.body;
    await updatePost(postId, title, description);
    res.redirect('/posts');
  });

router
  .route('/posts/delete/:postId')
  .get(getAccountUsername, async (req, res, next) => {
    const postId = req.params.postId;
    const post = await getPostById(postId);
    const comments = await getAllComments(postId);
    const locals = { pageTitle: 'Delete Post', post, comments, postId, ...req.locals };
    res.render('post_details', { locals });
  })
  .delete(async (req, res, next) => {
    const postId = req.params.postId;
    await deletePost(postId);
    res.redirect('/posts');
  });

router
  .route('/posts/:postId')
  .get(getAccountUsername, async (req, res, next) => {
    const { userId = -1 } = req._auth;
    const postId = req.params.postId;
    const post = await getPostById(postId);
    const comments = await getAllComments(postId);
    const locals = { pageTitle: 'Post', post, comments, userId, ...req.locals };
    res.render('post_details', { locals });
  })
  .post(async (req, res, next) => {
    const { userId = -1 } = req._auth;
    const { title, description } = req.body;
    await createPost(title, description, userId);
    res.redirect('/posts');
  });

module.exports = {
  router,
};
