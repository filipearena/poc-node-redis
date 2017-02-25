'use strict';

(function () {
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'form/view/form.html',
                controller: 'formController as form'
            })
            .when('/view1/:user', {
                templateUrl: 'form/view/form.html',
                controller: 'formController as form'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    angular.module('myApp.form', ['ngRoute']).config(config)
})();