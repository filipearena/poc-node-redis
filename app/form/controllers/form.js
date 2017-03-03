'use strict';

(function () {

    function formCtrl($scope, formService, formFactory, $routeParams, $location, Socket, Notification, $timeout) {

        var vm = this;

        Socket.connect();

        $scope.$on('locationChangeStart', function () {
            Socket.disconnect(true);
        });

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

        vm.formIsDone = false;

        var user = $routeParams.user;

        if (!user) {
            formService.getAllUsers().then(function (data) {
                vm.users = formFactory.fromGetAllUsers(data);
            });
            Notification.error({message: 'Favor fornecer um usuário na url', positionY: 'top', positionX: 'left'});
            $location.path("");
        }

        var obterDados = function () {
            formService.getDados(user).then(function (data) {
                vm.dados = formFactory.fromGetDados(data);
                if (!vm.dados.nome) {
                    //Se não existe nada no mongo para este usuário, deve-se buscar no redis
                    Socket.emit("get-dados", user);
                }
                else {
                    vm.formIsDone = true;
                }
            })
        };

        var validateEmail = function (email) {
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(email);
        };

        vm.formUpdated = function () {
            if (vm.dados) {
                vm.dados = formFactory.toModelChangedEvent(vm.dados);
                Socket.emit("model-changed", {chave: user, dados: JSON.stringify(vm.dados)});
            }
        };

        vm.submit = function (form) {
            var isValidEmail = validateEmail(vm.dados.email);
            if (!isValidEmail){
                Notification.error({message: 'Favor utilizar um email válido', positionY: 'top', positionX: 'center'});
                return;
            }
            if(form.$valid && isValidEmail){
                formService.postDados(vm.dados, user).then(function () {
                    vm.formIsDone = true;
                    Socket.emit("form-done", user);
                    Notification.success({message: 'Dados enviados com sucesso!', positionY: 'top', positionX: 'center'});
                })
            }
        };

        var obterMensagensChat = function () {
            Socket.emit("get-mensagens-chat");
        };

        var gerarUsuarioRandomico = function () {
            vm.usuarioRandom = formFactory.getRandomUserName();
        };

        Socket.on("return-messagens-chat", function (messages) {
            vm.chatMessages = JSON.parse(messages) || [];
        });

        var init = function () {
            obterDados();
            obterMensagensChat();
            gerarUsuarioRandomico();
        };

        init();

        Socket.on("mensagens-updated", function () {
            Socket.emit("get-new-messages");
        });

        Socket.on("return-new-messages", function (newMessages) {
            vm.chatMessages = JSON.parse(newMessages);
            $timeout(function() {
                document.getElementById('chat').scrollTop = 999999999999
            }, 100);
        });

        vm.sendChat = function (mensagem) {
            vm.chatMessages.push(vm.usuarioRandom + ": " + mensagem);
            Socket.emit("message-sent", JSON.stringify(vm.chatMessages));
            vm.mensagem = "";
            $timeout(function() {
                document.getElementById('chat').scrollTop = 999999999999
            }, 100);
        }


    }

    angular.module('myApp.form', ['ngRoute']).controller('formController', formCtrl)
})();