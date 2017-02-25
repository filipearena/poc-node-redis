'use strict';
//Dependencies
var path = require('path');
var express = require('express');
var rootPath = path.normalize(__dirname);
var port = process.env.PORT || '9001';
var mongoose = require('mongoose');
var app = express();

var router = express.Router();

var formMethods = require('./server/api/formMethods');

mongoose.connect("mongodb://heroku_kccj42rv:f929ef1ernlbs3sr1n7n08he93@ds161029.mlab.com:61029/heroku_kccj42rv");

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);

app.use('/', express.static(path.resolve(path.join(__dirname, "app"))));

router.get('/api/getDados/:user', formMethods.getDados);

router.post('/api/postDados/:user', formMethods.postDados);

app.set('view engine', 'html');
app.set('views', rootPath);

function startServer() {
    app.listen(port, undefined, function () {
        console.log('Listening on port %d', port);
    });
}

