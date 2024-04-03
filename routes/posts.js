const express = require('express');
const router = express.Router();
const { getAccountUsername, restrictUnauthAccess } = require('../middleware/auth');
const {
  getPostById,
  getAllComments,
  createPost,
  updatePost,
  deletePost,
  createComment,
  deleteComment,
} = require('../controllers/postController');

router
  .route('/posts/new')
  .get(getAccountUsername, async (req, res, next) => {
    const { userId = -1 } = req._auth;
    const locals = { pageTitle: 'New Post', userId, ...req.locals };
    res.render('new_post', { locals });
  })
  .post(restrictUnauthAccess, async (req, res, next) => {
    const { userId = -1 } = req._auth;
    const { title, description } = req.body;
    await createPost(title, description, userId);
    res.redirect('/posts');
  });

router
  .route('/posts/edit/:postId')
  .get(getAccountUsername, async (req, res, next) => {
    const postId = req.params.postId;
    const post = await getPostById(postId);
    const locals = { pageTitle: 'Edit Post', post, postId, ...req.locals };
    res.render('update_post', { locals });
  })
  .put(restrictUnauthAccess, async (req, res, next) => {
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
  .delete(restrictUnauthAccess, async (req, res, next) => {
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
    const locals = { pageTitle: 'Post', post, comments, postId, userId, ...req.locals };
    res.render('post_details', { locals });
  })
  .post(restrictUnauthAccess, async (req, res, next) => {
    const { userId = -1 } = req._auth;
    const postId = req.params.postId;
    const { comment } = req.body;
    await createComment(comment, userId, postId);
    res.redirect(`/posts/${postId}`);
  })
  .delete(restrictUnauthAccess, async (req, res, next) => {
    const postId = req.params.postId;
    const { commentId } = req.body;
    await deleteComment(commentId);
    res.redirect(`/posts/${postId}`);
  });

module.exports = {
  router,
};
