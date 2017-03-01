'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var port = process.env.PORT || 9001;
var bodyParser = require('body-parser');
var api = express.Router();
app.use(bodyParser.json());

//
// var redis = require("redis");
// var client = redis.createClient(app);

var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log("Novo usuario conectado");

    socket.on('user-data-changed', function (data) {
        //fazer update no redis
        console.log("user",data.chave);
    });

    socket.on('disconnect', function () {
        console.log("Usuario desconectado");
    })
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/poc-node-redis");

app.use(express.static('./app'));

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);

require('./server/api/formMethods.js')(app);

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

function startServer() {
    http.listen(port, function () {
        console.log('Listening on port %d', port);
    });
}


