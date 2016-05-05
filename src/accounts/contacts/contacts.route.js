(function () {
    'use strict';
    angular
    .module('contacts')
    .config(function($stateProvider) {
        $stateProvider
        .state('root.accounts.contacts',{
            url: '/contacts/{accountId}',
            views: {
                'contacts@root.accounts': {
                    templateUrl: 'contacts',
                    controller: 'contactListController',
                    controllerAs: 'vm'
                }
            }
        });
    });
})();