const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const docs = require('./routes/docs');
const endpoints = require('./routes/endpoints');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.redirect('/star-stuff'));
app.use('/star-stuff', docs);
app.use('/star-stuff/v1', endpoints);

module.exports = app;