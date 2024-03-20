require('dotenv').config();
const config = require('config');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const { router: pageRouter } = require('./routes/pages');

const server = express();

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to the database!'));

server.use(express.static('public'));
server.use(express.json());
server.use(expressLayouts);
server.set('layout', './layouts/main');
server.set('view engine', 'ejs');

server.use('/', pageRouter);

const { port: serverPort } = config.server;
server.listen(serverPort, () => {
  console.log(`Server listening on [${serverPort}] port!`);
});
