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

        vm.formUpdated = function () {
            if (vm.dados) {
                vm.dados = formFactory.toModelChangedEvent(vm.dados);
                Socket.emit("model-changed", {chave: user, dados: JSON.stringify(vm.dados)});
            }
        };

        Socket.on("model-updated", function () {
            Socket.emit("get-updated-dados", user);
        });

        Socket.on("get-dados-result", function (data) {
            vm.dados = JSON.parse(data);
        });

        Socket.on("form-read-only", function (updatedUser) {
            if(updatedUser == user){
                vm.formIsDone = true;
            }
        });

        if (!user) {
            $window.alert("Favor fornecer um usuario na url!");
            $location.path("");
        }

        var obterDados = function () {
            formService.getDados(user).then(function (res) {
                vm.dados = formFactory.fromGetDados(res);
                if (vm.dados.nome.length == 0) {
                    Socket.emit("get-dados", user);
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
                    Socket.emit("form-done", user);
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