korgie.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/Events');
    $urlRouterProvider.when("/Contacts", "/Contacts/MyContacts");

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
        })

        .state('contacts', {
            url: '/Contacts',
            templateUrl: '../../ContentViews/Contacts.html',
            controller: 'contactsCtrl'
        })

        .state('contacts.mycontacts', {
            url: '/MyContacts',
            templateUrl: '../../ContentViews/MyContacts.html',
            controller: 'mycontactsCtrl'
        })

        .state('contacts.addcontact', {
            url: '/AddContact',
            templateUrl: '../../ContentViews/AddContact.html',
            controller: 'addcontactCtrl'
        })

        .state('contacts.sent', {
            url: '/Sent',
            templateUrl: '../../ContentViews/Sent.html',
            controller: 'sentCtrl'
        })

        .state('contacts.recieved', {
            url: '/Recieved',
            templateUrl: '../../ContentViews/REcieved.html',
            controller: 'recievedCtrl'
        });

});