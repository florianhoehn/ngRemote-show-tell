(function () {
    'use strict';
    angular
    .module('contacts')
    .controller('contactListController',
                ['$stateParams',
                'contactService',
                function($stateParams, contactService) {
        var vm = this;
        vm.contacts = [];

        activate();
        
        function activate() {
            // still going through ngRemote -> only gets the result array
            contactService.retrieveByParentId('AccountId', $stateParams.accountId, 5)
                          .then(function(result) {
                if(result) {
                    console.log('You got some extra?', result); // NO!
                    vm.contacts = result;
                }
            }, function(error) {
                console.log('contactListController:contactService:retrieveRecentItems:error:', error);
            });
        }
    }]);
})();