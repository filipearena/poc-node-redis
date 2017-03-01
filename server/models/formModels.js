var mongoose = require('mongoose');

var schema = {
    chave: String,
    nome: String,
    sobrenome: String,
    email: String
};

var formModels = mongoose.model("formModels", schema);

module.exports = formModels;