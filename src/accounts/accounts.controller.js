(function () {
    'use strict';
    angular
    .module('accounts')
    .controller('accountListController',
                ['accountService',
                'massAccountService',
                function(accountService, massAccountService) {
        var vm = this;
        vm.accounts = [];
        vm.massAccounts = [];

        activate();
        
        function activate() {
            accountService.retrieveRecentItems(5)
                          .then(function(result) {
                if(result) {
                    vm.accounts = result;
                }
            }, function(error) {
                console.log('accountListController:accountService:retrieveRecentItems:error:', error);
            });

            massAccountService.getAll()
                              .then(function(result) {
                if(result) {
                    vm.massAccounts = result;
                }
            }, function(error) {
                console.log('accountListController:massAccountService:getAll:error:', error);
            });
        }
    }]);
})();