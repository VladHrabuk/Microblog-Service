require('dotenv').config();

const config = require('config');
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const { router: pageRouter } = require('./routes/pages');
const { router: postRouter } = require('./routes/posts');
const { jwtParser } = require('./middleware/auth');

const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./exceptions/api-error');

const server = express();

server.use(cookieParser());
server.use(methodOverride('_method'));
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.json());
server.use(expressLayouts);
server.set('layout', './layouts/main');
server.set('view engine', 'ejs');

server.use(jwtParser);
server.use('/', pageRouter);
server.use('/', postRouter);

server.all('*', async (req, res, next) => {
  const error = ApiError.notFound();
  next(error);
});

server.use(errorHandler);

const { port: serverPort } = config.server;
server.listen(serverPort, () => {
  console.log(`Server listening on [${serverPort}] port!`);
});
