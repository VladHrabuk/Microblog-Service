module.exports = {
  server: {
    port: process.env.PORT || 3000,
  },
  jwtConfig: {
    secret: process.env.SECRET_JWT || 'super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  },
};
