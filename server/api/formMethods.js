var formModels = require("../models/formModels");

var formMethods = {
    getDados: function (req, res, next) {
        formModels.find(function (err, data) {
            if(err) console.error;
            res.json(data)
        })
    },
    
    postDados: function (req, res, next) {
        res.json({type: "Update", id: req.param.user, body: req.body})
    }

};

module.exports = formMethods;

