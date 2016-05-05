(function () {
    'use strict';
    angular
    .module('main')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('root', {
            url: '',
            abstract: true,
            views: {
                'header': {
                    templateUrl: 'header'
                },
                'footer': {
                    templateUrl: 'footer'
                }
            }
        })
        .state('root.ooops', {
            url: '/ooops',
            views: {
                'mainSection@': {
                    templateUrl: 'ooops'
                }
            }
        });
        $urlRouterProvider.otherwise('/accounts');
    });
})();