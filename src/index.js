//contiente l'express framework per creare la REST API
const express = require('express');
//gestisce le richieste
const cors = require('cors');
//si assicura che i corpi siano allegati alle richieste
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./events');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'webco'
});

connection.connect();

const port = process.env.PORT || 2501;

const app = express().use(cors()).use(bodyParser.json()).use(events(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});