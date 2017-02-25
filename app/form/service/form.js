'use strict';

(function () {
    function formService($http, appSettings) {

        return {
            getDados: function (user) {
                return $http.get(appSettings.apiEndpoint + '/getDados/' + user);
            },
            postDados: function (data, user) {
                return $http.post(appSettings.apiEndpoint + '/postDados/' + user, data)
            }
        }
    }
    angular.module('myApp.form').service('formService', formService);
})();