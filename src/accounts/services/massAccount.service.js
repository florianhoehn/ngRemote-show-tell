(function () {
    'use strict';
    angular
    .module('accounts')
    .factory('massAccountService',
            ['$q',
            function ($q) {
        var service = {
            getAll : getAll
        };

        return service;

        function getAll() {
            var deferred = $q.defer();
            
            Visualforce.remoting.Manager.invokeAction(
                'DemoController.getAll',
                function(result,
                         event) {
                    if(event.status && result) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(event);
                    }
                }, {
                    buffer: true,
                    escape: false,
                    timeout: 30000
                }
            );

            return deferred.promise;
        }
    }]);
})();