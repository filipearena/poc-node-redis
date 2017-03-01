'use strict';

(function () {

    function formCtrl(formService, formFactory, $routeParams, $window, $location) {

        var vm = this;

        var user = $routeParams.user;

        if (!user) {
            $window.alert("Favor fornecer um usuario na url!");
            $location.path("");
        }

        var obterDados = function () {
            formService.getDados(user).then(function (res) {
                vm.dados = formFactory.fromGetDados(res);
            });
        };

        vm.submit = function () {
            formService.postDados(vm.dados, user).then(function () {
                console.log("dados uploaded!");
            })
        };

        var init = function () {
            obterDados();
        };

        init();
    }

    angular.module('myApp.form', ['ngRoute']).controller('formController', formCtrl)
})();