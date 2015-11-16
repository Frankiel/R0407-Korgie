korgie.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/Events');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('events', {
            url: '/Events',
            templateUrl: '../../ContentViews/Events.html',
            controller: 'eventsCtrl'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('settings', {
            url: '/Settings',
            templateUrl: '../../ContentViews/Settings.html',
            controller: 'settingsCtrl'
        });

});