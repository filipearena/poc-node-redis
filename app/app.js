'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.form',
    'btford.socket-io',
    'ui-notification'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'form/view/error.html',
            controller: 'formController as form'
        })
        .when('/:user', {
            templateUrl: 'form/view/form.html',
            controller: 'formController as form'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
