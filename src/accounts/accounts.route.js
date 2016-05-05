(function () {
    'use strict';
    angular
    .module('accounts')
    .config(function($stateProvider) {
        $stateProvider
        .state('root.accounts',{
            url: '/accounts',
            views: {
                'mainSection@': {
                    templateUrl: 'accounts',
                    controller: 'accountListController',
                    controllerAs: 'vm'
                }
            }
        });
    });
})();