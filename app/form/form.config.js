'use strict';

(function () {
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'form/view/view1.html',
                controller: 'View1Ctrl as ctrl1'
            })
            .when('/view1/:user', {
                templateUrl: 'form/view/view1.html',
                controller: 'View1Ctrl as ctrl1'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    angular.module('myApp.form', ['ngRoute']).config(config)
})();