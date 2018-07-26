'use strict';

// TODone REVIEW should the server side also use iife?
// No; client side has multiple js file like views and models, and name collision prevention is more relevant there.

const pg = require('pg');
const express = require('express');
// TODone REVIEW Use HTTP CORS to allow this web app to access the database from a different domain.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cors = require('cors');

// const PORT = process.env.PORT; //this is the preferred method
const PORT = process.env.PORT || 3000; //this is when running locally

const app = express();
app.use(cors());

// Some notes and lessons from this lab around db connections.
// This next line is a hard coded connect string really meant for local testing where no deployed environment exists.
// const conString = 'postgres://hoffit:password@localhost:5432/books_app';
// This next line is more standard for deployed apps where an environment variable is used to detect whether running
// local or on a deployed server. It's set in index.js.
const conString = process.env.DATABASE_URL;
// This next line is incorrect...don't hard config database url...
// const conString = 'postgres://sokqhqjxzbhshd:59a24d75cd73b92f8cb8cd9dd2bcb86e5d32ba08f22992a18fc1487b96c16b2d@ec2-54-204-23-228.compute-1.amazonaws.com:5432/d3t5euqm6musdv'
// When running local, extra step to setup that env variable using terminal command export DATABASE_URL='postgres://hoffit:password@localhost:5432/books_app'
//                                                                                         DATABASE_URL='postgres://postgres:Angrybritches07@localhost:5432/books_app'
console.log('app server side con string is '+conString);

const client = new pg.Client(conString);
client.connect();
client.on('error', error => {
  console.error(error);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

// TODone change to api notation like this /api/v1/books
app.get('/api/v1/books', (request, response) => {
  let sql = 'SELECT book_id, author, title, image_url FROM books';

  client
    .query(sql)
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (err) {
      console.error(err);
    });
});
app.get('/api/v1/books:id', (request, response) => {
  let sql = 'SELECT book_id, author, title, isbn, description, image_url FROM books WHERE book_id=$1';
  let values = [
    request.body.params_id
  ];


  client
    .query(sql, values)
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.get('*', (request, result) => result.status(404).send('this route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
