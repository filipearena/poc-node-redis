var formModels = require("../models/formModels");

function getDados(req, res) {
    formModels.find({chave: req.params.user},function (err, data) {

        if (err) {
            res.send(err);
        }

        res.json(data);
    });
}

module.exports = function (app) {
    app.get('/api/getDados/:user', function (req, res) {
        getDados(req, res);
    });

    app.post('/api/postDados/:user', function (req, res) {
        formModels.update({chave: req.params.user},{
            chave: req.params.user,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email
        },{ upsert: true }, function (err) {
            if (err)
                res.send(err);

            getDados(req, res);
        });

    });

    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/app/index.html');
    });

};

