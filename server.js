'use strict';

// TODO REVIEW should the server side also use iife?

const pg = require('pg');
const express = require('express');
// TODone REVIEW Use HTTP CORS to allow this web app to access the database from a different domain.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cors = require('cors');

const PORT = process.env.PORT; //this is the preferred method
// const PORT = process.env.PORT || 3000; //this is when running locally

const app = express();
app.use(cors());

// Some notes and lessons from this lab around db connections.
// This next line is a hard coded connect string really meant for local testing where no deployed environment exists.
// const conString = 'postgres://hoffit:password@localhost:5432/books_app';
// This next line is more standard for deployed apps where an environment variable is used to detect whether running
// local or on a deployed server. It's set in index.js.
const conString = 'process.env.DATABASE_URL';
// This next line is incorrect...don't hard config database url...
// const conString = 'postgres://sokqhqjxzbhshd:59a24d75cd73b92f8cb8cd9dd2bcb86e5d32ba08f22992a18fc1487b96c16b2d@ec2-54-204-23-228.compute-1.amazonaws.com:5432/d3t5euqm6musdv'
// When running local, extra step to setup that env variable using terminal command export DATABASE_URL='postgres://localhost:5432'

console.log('app server side con string is '+conString);

const client = new pg.Client(conString);
client.connect();
client.on('error', error => {
  console.error(error);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

app.get('/books', (request, response) => {
  let sql = 'SELECT book_id, author, title, isbn, image_url, description FROM books';

  client
    .query(sql)
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (err) {
      console.error(err);
    });
});
