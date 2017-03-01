'use strict';

(function () {
    function formFactory() {

        return {
            fromGetDados: function (data) {
                if (angular.isUndefined(data) || angular.isUndefined(data.data[0])) {
                    return {}
                }

                var dados = data.data[0];

                return {
                    nome: dados.nome,
                    sobrenome: dados.sobrenome,
                    email: dados.email
                };
            }
        }
    }

    angular.module('myApp.form').factory('formFactory', formFactory)
})();