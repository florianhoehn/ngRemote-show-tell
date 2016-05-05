(function () {
    'use strict';
    angular
    .module('main')
    .run(['$rootScope',
          '$state',
          '$location',
          '$window',
          function ($rootScope, $state, $location, $window) {
        $rootScope.$on('$stateChangeStart', function() {
            $rootScope.stateIsLoading = true;
        });

        $rootScope.$on('$stateChangeSuccess', function() {
            $rootScope.stateIsLoading = false;
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $state.go('root.ooops');
        });
    }]);
})();