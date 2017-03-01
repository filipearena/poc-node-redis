'use strict';
//Dependencies
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 9001; 				// set the port
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // parse application/json

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
    app.listen(port, function () {
        console.log('Listening on port %d', port);
    });
}

