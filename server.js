'use strict';

const pg = require('pg');
const express = require('express');
/**
 * Notes from lecture: we need one of the two port lines below depending on whether we're running locally, or deploying.
 * The preferred method is the first one. Another way to do this is to use command line with the following:
 * export PORT=3000. TODO Figure out why the command does not work in IntelliJ terminal.
 */
const PORT = process.env.PORT; //this is the preferred method
// const PORT = process.env.PORT || 3000; //this is when running locally

const app = express();

const conString = 'postgres://hoffit:password@localhost:5432/kilovolt';

const client = new pg.Client(conString);
client.connect();
client.on('error', error => {
  console.error(error);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

app.get('/', (request, response) => {
  response.send('test 1 2 3');
});