'use strict';
//Dependencies
var path = require('path');
var express = require('express');

var port = process.env.PORT || '9001';
var rootPath = path.normalize(__dirname);

var app = express();

app.get('/', function (req, res) {
    return res.redirect('/');
});

app.listen(port, undefined, function () {
    console.log('Listening on port %d', port);
});