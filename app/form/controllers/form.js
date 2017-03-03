'use strict';

(function () {

    function formCtrl($scope, formService, formFactory, $routeParams, $location, Socket, Notification) {

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
                Notification.warning({message: 'Um usuário enviou o formulario antes de você!', positionY: 'top', positionX: 'center'});
                vm.formIsDone = true;
            }
        });

        if (!user) {
            Notification.error({message: 'Favor fornecer um usuário na url', positionY: 'top', positionX: 'center'});
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

        var validateEmail = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };


        vm.submit = function (form) {
            var emailValido = validateEmail(vm.dados.email);
            if (!emailValido){
                Notification.error({message: 'Favor colocar um email válido!', positionY: 'top', positionX: 'center'});
                return;
            }
            if(form.$valid && emailValido){
                formService.postDados(vm.dados, user).then(function () {
                    vm.formIsDone = true;
                    Socket.emit("form-done", user);
                    Notification.success({message: 'Dados enviados com sucesso!', positionY: 'top', positionX: 'center'});
                })
            }
            else {
                notify('Favor preencher todos os campos');
            }
        };

        var init = function () {
            obterDados();
        };

        init();
    }

    angular.module('myApp.form', ['ngRoute']).controller('formController', formCtrl)
})();