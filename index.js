"use strict";

const express = require('express');
const app = express();
const setup = require('./renderer');

async function main() {
  let index = await setup();

  app.use((req, _, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  app.get("/", (req, res) => {
    res.send(index);
  });

  app.use(express.static("./"));

  app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
  });
}

main();