'use strict';
//Dependencies
var path = require('path');
var express = require('express');
var rootPath = path.normalize(__dirname);
var port = process.env.PORT || '9001';
var app = express();

app.use('/', express.static(path.resolve(path.join(__dirname, "app"))));

app.set('view engine', 'html');
app.set('views', rootPath);

app.listen(port, undefined, function () {
    console.log('Listening on port %d', port);
});