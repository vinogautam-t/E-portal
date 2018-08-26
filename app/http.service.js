(function () {
    'use strict'

    angular.module('app')
        .factory('httpService', httpRestService);

    httpRestService.$inject = ['$http', '$q'];

    function httpRestService($http, $q) {

        return {
            get: get,
            post: post
        }

        function get(url) {
            return $http.get(url);
        }

        function post(url, req) {
            var deferred = $q.defer(),
                apiPromise;

            apiPromise = $http({
                method: 'POST',
                url: url,
                data: $.param(req), //forms user object
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            apiPromise.then(function(response){
                deferred.resolve(response.data);
            }, function(response){
                deferred.reject(response.data);
            });

            return deferred.promise;

        }

    }

})();