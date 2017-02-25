'use strict';

(function () {
    function formFactory() {

        return {
            fromGetDados: function (data) {
                if (angular.isUndefined(data)) {
                    return {}
                }

                return data;
            }
        }
    }

    angular.module('myApp.form').factory('formFactory', formFactory)
})();