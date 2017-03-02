'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var port = process.env.PORT || 9001;
var bodyParser = require('body-parser');
var api = express.Router();
app.use(bodyParser.json());

//redis://rediscloud:password@localhost:6379

var redis = require("redis");
var client;

if(process.env.REDISCLOUD_URL){
    client = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});
}
else {
    client = redis.createClient(http);
}


var io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log("Novo usuario conectado");

    socket.on('model-changed', function (data) {
        console.log("index.js model-changed com data: ", data);
        client.set(data.chave, data.dados, function () {
            //Atualiza todos outros clients menos o que fez o update
            socket.broadcast.emit('model-updated');
        });
    });

    socket.on('get-dados', function (user) {
        console.log("index.js get-dados com user: ", user);
        client.get(user, function (err, reply) {
            console.log("index.js get-dados-result com reply: ", reply);
            socket.emit('get-dados-result', reply);
        });
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


