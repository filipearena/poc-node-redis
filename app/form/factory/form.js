'use strict';

(function () {
    function formFactory() {

        return {
            fromGetDados: function (data) {
                if (angular.isUndefined(data) || angular.isUndefined(data.data[0])) {
                    return {
                        nome: "",
                        sobrenome: "",
                        email: ""
                    }
                }

                var dados = data.data[0];

                return {
                    nome: dados.nome,
                    sobrenome: dados.sobrenome,
                    email: dados.email
                };
            },
            toModelChangedEvent: function (data) {
                return {
                    nome: data.nome || "",
                    sobrenome: data.sobrenome || "",
                    email: data.email || ""
                }
            }
        }
    }

    angular.module('myApp.form').factory('formFactory', formFactory)
})();