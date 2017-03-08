'use strict';

(function () {

    function formCtrl($scope, formService, formFactory, $routeParams, $location, Socket, Notification, $timeout) {

        var vm = this;

        vm.formIsDone = false;

        var user = $routeParams.user;

        Socket.connect();

        //Caso a URL seja alterada o socket é desconectado
        $scope.$on('locationChangeStart', function () {
            Socket.disconnect(true);
        });

        //Após receber informação de que um usuário externo alterou o form, solicita a atualização do form para Redis
        Socket.on("model-updated", function () {
            Socket.emit("get-updated-dados", user);
        });

        //Após o NODE concluir o get do form atualizado externamente, atualizo o model do form para os outros usuários
        Socket.on("get-dados-result", function (data) {
            vm.dados = JSON.parse(data);
        });

        //Recebe um evento do Socket IO informando que algum usuário enviou o formulario
        Socket.on("form-read-only", function (updatedUser) {
            if (updatedUser == user) {
                Notification.warning({
                    message: 'Um usuário enviou o formulario antes de você!',
                    positionY: 'top',
                    positionX: 'center'
                });
                vm.formIsDone = true;
            }
        });

        //Função responsável por obter dados do MongoDB, caso não existam dados, tenta obter do Redis.
        var obterDados = function () {
            formService.getDados(user).then(function (data) {
                vm.dados = formFactory.fromGetDados(data);
                if (!vm.dados.nome) {
                    //Se não existe nada no mongo para este usuário, deve-se buscar no redis
                    Socket.emit("get-dados", user);
                }
                else {
                    //Caso existam dados no MongoDB significa que o formulário foi enviado e portanto, precisa ser bloqueado
                    vm.formIsDone = true;
                }
            })
        };

        //Função responsável por validar formato de e-mail
        var validateEmail = function (email) {
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(email);
        };

        //Função invocada no ng-change de cada input do form
        vm.formUpdated = function () {
            if (vm.dados) {
                //Factory que garante que os atributos do vm.dados não serão passado para Redis como undefined
                vm.dados = formFactory.toModelChangedEvent(vm.dados);
                //Evento o qual o NODE fará broadcast para outros usuários, indicando que o form foi alterado
                Socket.emit("model-changed", {chave: user, dados: JSON.stringify(vm.dados)});
            }
        };

        //Função invocada no submit do formulario
        vm.submit = function (form) {
            var isValidEmail = validateEmail(vm.dados.email);
            //Validação do e-mail
            if (!isValidEmail) {
                Notification.error({message: 'Favor utilizar um email válido', positionY: 'top', positionX: 'center'});
                return;
            }
            //Caso o formulario tenha sido preenchido E o email seja válido, prossegue para envido dos dados para Mongo
            if (form.$valid && isValidEmail) {
                formService.postDados(vm.dados, user).then(function () {
                    vm.formIsDone = true;
                    //Evento que travará o form para outros usuários
                    Socket.emit("form-done", user);
                    Notification.success({
                        message: 'Dados enviados com sucesso!',
                        positionY: 'top',
                        positionX: 'center'
                    });
                })
            }
        };

        // -----------CHAT---------------

        //Função responsável por fazer o scroll para base do chat após inclusão de uma nova mensagem
        var autoScrollDownChat = function () {
            $timeout(function () {
                document.getElementById('chat').scrollTop = 999999999999
            }, 100);
        };


        var gerarUsuarioRandomico = function () {
            vm.usuarioRandom = formFactory.getRandomUserName();
        };

        Socket.on("mensagens-updated", function (mensagem) {
            angular.isArray(vm.chatMessages) ? vm.chatMessages.push(mensagem) : vm.chatMessages = [mensagem];
            //vm.chatMessages = JSON.parse(mensagem) || [];
            autoScrollDownChat();
        });

        Socket.on("user-joined", function (numeroUsuarios) {
            console.log("user joined")
            vm.numeroUsuarios = numeroUsuarios;
        });

        vm.sendChat = function (mensagem) {
            var mensagemComposta = vm.usuarioRandom + ": " + mensagem;
            angular.isArray(vm.chatMessages) ? vm.chatMessages.push(mensagemComposta) : vm.chatMessages = [mensagemComposta];
            Socket.emit("message-sent", mensagemComposta);
            //Reseta input
            vm.mensagem = "";
            autoScrollDownChat();
        };

        // --------END CHAT------------

        var init = function () {
            if (!user) {
                //Service que obtém todos os usuários na base do MongoDB (exibição em cards)
                formService.getAllUsers().then(function (data) {
                    vm.users = formFactory.fromGetAllUsers(data);
                });

                Notification.error({message: 'Favor fornecer um usuário na url', positionY: 'top', positionX: 'left'});
                $location.path("");
            }
            //Funções de inicialização
            obterDados();
            gerarUsuarioRandomico();
        };

        init();

    }

    angular.module('myApp.form', ['ngRoute']).controller('formController', formCtrl)
})();