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
            fromGetAllUsers: function (data) {
                if (angular.isUndefined(data) || angular.isUndefined(data.data)) {
                    return []
                }

                return data.data;
            },
            toModelChangedEvent: function (data) {
                return {
                    nome: data.nome || "",
                    sobrenome: data.sobrenome || "",
                    email: data.email || ""
                }
            },
            getRandomUserName: function () {
                var namesList = ["batata", "baleia", "borboleta", "cadela", "cabra", "vaca"];
                var surnamesList = ["peluda", "rabugenta", "gorda", "nervosa", "tensa", "suada"];

                var rand1 = Math.floor(Math.random() * 6) + 1;
                var rand2 = Math.floor(Math.random() * 6) + 1;

                return namesList[rand1-1] + " " + surnamesList[rand2-1];
            }
        }
    }

    angular.module('myApp.form').factory('formFactory', formFactory)
})();