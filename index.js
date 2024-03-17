require('dotenv').config();
const config = require('config');
const express = require('express');

const server = express();

const { port: serverPort } = config.server;
const serverInstance = server.listen(serverPort, () => {
  console.log(`Server listening on [${serverPort}] port!`);
});
