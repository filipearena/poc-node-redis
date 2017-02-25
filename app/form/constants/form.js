'use strict';

(function () {

    var settings = {
        apiEndpoint: 'https://poc-node-redis.herokuapp.com/api'
    };

    angular.module('myApp').constant('appSettings', settings);
})();
