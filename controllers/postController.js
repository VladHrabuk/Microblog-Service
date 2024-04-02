const prisma = require('../prisma/index');

async function getAllPostsByPage(page, limit) {
  const skip = (page - 1) * limit;
  const posts = await prisma.post.findMany({
    skip,
    take: limit,
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const totalCount = await prisma.post.count();
  return { posts, totalCount };
}

async function getPostById(postId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        select: {
          username: true,
          name: true,
        },
      },
    },
  });
  return post;
}

async function getAllComments(postId) {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return comments;
}

async function getAllPostsByUser(userId) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return posts;
}

async function createPost(title, content, authorId) {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
  });
  return post;
}

async function updatePost(postId, title, content) {
  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      title,
      content,
      lastEditedAt: new Date(),
      edited: true,
    },
  });
  return post;
}

async function deletePost(postId) {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
  });

  for (const comment of comments) {
    await prisma.comment.delete({
      where: {
        id: comment.id,
      },
    });
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return deletedPost;
}

async function createComment(content, authorId, postId) {
  const comment = await prisma.comment.create({
    data: {
      content,
      author: { connect: { id: authorId } },
      post: { connect: { id: postId } },
    },
  });
  return comment;
}

async function deleteComment(commentId) {
  const deletedComment = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  return deletedComment;
}

module.exports = {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getAllComments,
  getAllPostsByUser,
  getAllPostsByPage,
  createComment,
  deleteComment,
};
