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
                var namesList = [
                    "ratazana",
                    "baleia",
                    "borboleta",
                    "cadela",
                    "cabra",
                    "vaca",
                    "egua",
                    "ema",
                    "fuinha",
                    "gata",
                    "morsa",
                    "porca",
                    "girafa",
                    "ovelha",
                    "foca",
                    "jamanta",
                    "minhoca",
                    "tartaruga",
                    "capivara",
                    "piranha"
                ];
                var surnamesList = [
                    "peluda",
                    "rabugenta",
                    "gorda",
                    "nervosa",
                    "tensa",
                    "suada",
                    "pelancuda",
                    "sinistra",
                    "esquisita",
                    "lerda",
                    "lesbica",
                    "noiada",
                    "esquisofrenica",
                    "dopada",
                    "desmiolada",
                    "desgovernada",
                    "mediocre",
                    "doidona",
                    "cabeçuda",
                    "biruta",
                    "ridicula",
                    "estupida",
                    "carente",
                    "raivosa",
                    "banguela",
                    "promiscua"
                ];

                var rand1 = Math.floor(Math.random() * 20) + 1;
                var rand2 = Math.floor(Math.random() * 26) + 1;

                return namesList[rand1 - 1] + " " + surnamesList[rand2 - 1];
            }
        }
    }

    angular.module('myApp.form').factory('formFactory', formFactory)
})();