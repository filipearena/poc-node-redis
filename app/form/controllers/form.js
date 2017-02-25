'use strict';

(function () {

    function formCtrl(formService, formFactory, $routeParams) {

        var vm = this;

        var user = $routeParams.user;

        console.log("user", user);

        var _service = formService.getDados(user);

        _service.then(function (res) {
            vm.dados = formFactory.fromGetDados(res);
        });

        vm.submit = function () {
            formService.postDados(vm.dados, user).then(function () {
                console.log("dados uploaded!");
            })
        }
    }

    angular.module('myApp.form', ['ngRoute']).controller('formController', formCtrl)
})();