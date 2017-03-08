'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var port = process.env.PORT || 9001;
var bodyParser = require('body-parser');
var api = express.Router();
app.use(bodyParser.json());

var redis = require("redis");
var client;

//Criando a instancia do client utilizado para manipulações do Redis, podendo ser local ou Redis Cloud (heroku)
client = redis.createClient(process.env.REDISCLOUD_URL || http);

// client = redis.createClient(process.env.REDISCLOUD_URL || http, {no_ready_check: true});


var io = require('socket.io')(http);

//Iniciando conexão com socket
io.on('connection', function (socket) {

    // -----------FORM---------

    socket.on('model-changed', function (data) {
        client.set(data.chave, data.dados, function () {
            //Atualiza todos outros clients menos o que de fato realizou o update
            socket.broadcast.emit('model-updated');
        });
    });

    socket.on('get-dados', function (user) {
        client.get(user, function (err, reply) {
            socket.emit('get-dados-result', reply);
        });
    });

    socket.on('get-updated-dados', function (user) {
        client.get(user, function (err, reply) {
            //Deveria ser só para externos
            socket.emit('get-dados-result', reply);
        });
    });

    socket.on("form-done", function (user) {
        socket.broadcast.emit('form-read-only', user);
    });

    // --------CHAT-------------



    socket.emit("user-joined", Object.keys(io.sockets.connected).length);
    socket.broadcast.emit("user-joined", Object.keys(io.sockets.connected).length);

    socket.on("message-sent", function (mensagem) {
        socket.broadcast.emit('mensagens-updated', mensagem);
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit("user-joined", Object.keys(io.sockets.connected).length);
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


