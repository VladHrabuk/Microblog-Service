require('dotenv').config();
const config = require('config');
const express = require('express');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const { router: pageRouter } = require('./routes/pages');
const { jwtParser } = require('./middleware/auth');

const server = express();

server.use(cors());
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.static('public'));
server.use(express.json());
server.use(jwtParser);
server.use(expressLayouts);
server.set('layout', './layouts/main');
server.set('view engine', 'ejs');

server.use('/', pageRouter);

const { port: serverPort } = config.server;
server.listen(serverPort, () => {
  console.log(`Server listening on [${serverPort}] port!`);
});
