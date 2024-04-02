module.exports = {
  server: {
    port: process.env.PORT || 3000,
  },
  jwt: {
    secret: process.env.SECRET_JWT || 'my-default-super-secret-phrase',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  }
};
