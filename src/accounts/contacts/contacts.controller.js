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
            contactService.retrieveByParentId('AccountId', $stateParams.accountId, 5)
                          .then(function(result) {
                if(result) {
                    vm.contacts = result;
                }
            }, function(error) {
                console.log('contactListController:contactService:retrieveRecentItems:error:', error);
            });
        }
    }]);
})();