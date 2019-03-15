// Acknowledgement:
// freeCodeCamp Sample Project
// https://glitch.com/edit/#!/thread-paper

'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

var urlHandler = require("./controllers/urlHandler")

// Basic Configuration 
var port = process.env.PORT || 3000;

// Connect to db
mongoose.connect(process.env.MONGOLAB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("db connected");
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/public/index.html');
});

  
// POST new URL
app.post("/api/shorturl/new", urlHandler.addURL);

// GET saved URL from short URL
app.get('/:shurl', urlHandler.getURL);


// 404 not found to all other routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});