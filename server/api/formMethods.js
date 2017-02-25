var formModels = require("../models/formModels");

var formMethods = {
    getDados: function (req, res, next) {
        console.log("getDados");
        formModels.find(function (err, data) {
            if(err) console.error;
            res.json(data)
        })
    },
    
    postDados: function (req, res, next) {
        console.log("postDados");
        var formModels = new formModels({
            nome: req.body.username,
            sobrenome: req.body.sobrenome,
            email: req.body.email
        });
        formModels.save(function (err, post) {
            if (err) { return next(err) }
            res.json(201, post)
        })
    }

};

module.exports = formMethods;

