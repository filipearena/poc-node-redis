'use strict';

(function () {

    function formCtrl($scope, formService, formFactory, $routeParams, $window, $location, Socket) {

        var vm = this;

        vm.formIsDone = false;

        var user = $routeParams.user;

        Socket.connect();

        $scope.$on('locationChangeStart', function () {
            Socket.disconnect(true);
        });

        $scope.$watchCollection("form.dados", function () {
            if (vm.dados) {
                console.log("do watch", vm.dados);
                vm.dados = formFactory.toModelChangedEvent(vm.dados);
                Socket.emit("model-changed", {chave: user, dados: JSON.stringify(vm.dados)});
            }
        });

        Socket.on("model-updated", function () {
            Socket.emit("get-dados", user);
            Socket.on("get-dados-result", function (data) {
                vm.dados = JSON.parse(data);
            });
        });

        if (!user) {
            $window.alert("Favor fornecer um usuario na url!");
            $location.path("");
        }

        var obterDados = function () {
            formService.getDados(user).then(function (res) {
                vm.dados = formFactory.fromGetDados(res);
                console.log("vm.dados vindo do mongo", vm.dados);
                if (vm.dados.nome.length == 0) {
                    Socket.emit("get-dados", user);
                    Socket.on("get-dados-result", function (data) {
                        vm.dados = JSON.parse(data);
                    });
                }
                else {
                    vm.formIsDone = true;
                }
            })
        };


        vm.submit = function (form) {
            if(form.$valid){
                formService.postDados(vm.dados, user).then(function () {
                    console.log("dados uploaded!");
                    vm.formIsDone = true;
                })
            }
            else {
                $window.alert("Favor preencher todos os campos antes de enviar!");
            }
        };

        var init = function () {
            obterDados();
        };

        init();
    }

    angular.module('myApp.form', ['ngRoute']).controller('formController', formCtrl)
})();