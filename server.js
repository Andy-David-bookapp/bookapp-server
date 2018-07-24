'use strict';

// TODO REVIEW should the server side also use iife?

const pg = require('pg');
const express = require('express');
// TODO REVIEW Use HTTP CORS to allow this web app to access the database from a different domain.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// TODO there is something in here we need like const cors (id:string) => any

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
