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

module.exports = {
  findUser,
  addNewUser,
};
