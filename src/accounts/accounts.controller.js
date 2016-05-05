(function () {
    'use strict';
    angular
    .module('accounts')
    .controller('accountListController',
                ['accountService',
                function(accountService) {
        var vm = this;
        vm.accounts = [];

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
        }
    }]);
})();