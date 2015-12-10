korgie.controller('notificationsCtrl', function ($scope, $state, korgieApi, $state) {
    korgieApi.setCurState('notifications');

    $scope.nots = [{ id: 1, type: 1, actual: true, data: 'azazazaz', date: '10.12.2015'  },
                    { id: 1, type: 2, actual: false, data: 'nonono', date: '10.12.2015' },
                    { id: 1, type: 3, actual: true, data: 'azazazaz', date: '10.12.2015' },
                    { id: 1, type: 1, actual: false, data: 'nonono', date: '10.12.2015' },
                    { id: 1, type: 2, actual: false, data: 'nonono', date: '10.12.2015' },
                    { id: 1, type: 3, actual: true, data: 'azazazaz', date: '10.12.2015' },
                    { id: 1, type: 1, actual: true, data: 'azazazaz', date: '10.12.2015' }, ];

    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    }
});