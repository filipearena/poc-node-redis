'use strict';

(function () {
    function formService($http, appSettings) {

        return {
            getDados: function (user) {
                return $http.get(appSettings.apiEndpoint + '/dados/' + user);
            }
        }
    }
    angular.module('myApp.form').service('formService', formService);
})();