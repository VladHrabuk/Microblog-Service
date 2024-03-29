const prisma = require('../prisma/index');

async function paginationPosts(req, page, limit) {
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

async function getAllPosts() {
  const posts = await prisma.post.findMany({
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

async function getUsername(userId) {
  const username = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      username: true,
    },
  });
  return username;
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
  const post = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return post;
}

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getAllComments,
  getAllPostsByUser,
  getUsername,
  paginationPosts,
};
