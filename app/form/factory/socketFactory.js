'use strict';

(function () {
    function Socket(socketFactory) {
        return socketFactory();
    }

    angular.module('myApp.form').factory('Socket', Socket)
})();