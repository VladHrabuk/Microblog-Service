const prisma = require('../prisma/index');

async function findUser({ username }) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  return user;
}

async function addNewUser({ username, name, password }) {
  const user = await prisma.user.create({
    data: {
      username,
      name,
      password,
    },
  });
  return user;
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

module.exports = {
  findUser,
  addNewUser,
  getUsername,
};
