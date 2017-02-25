'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.form'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
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
}]);
