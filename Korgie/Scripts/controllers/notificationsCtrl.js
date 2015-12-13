korgie.controller('notificationsCtrl', function ($scope, $state, korgieApi) {
    korgieApi.setCurState('notifications');

    $scope.notifications;

    $scope.showHideMenu = function () {
        korgieApi.showHideMenu();
    }

    korgieApi.getNotifications().then(function (res) {
        $scope.notifications = res;
        console.log(res);
        //moment(todoData[i].Start)
    });

    $scope.uncheck = function (index) {
        korgieApi.checkNotify(index).then(function (res) {
            for (var i = 0; i < $scope.notifications.length; i++) {
                if ($scope.notifications[i].NotId == index) {
                    $scope.notifications[i].Actual = false;
                }
            }
        });
    };

    $scope.isActual = function (id) {
        for (var i = 0; i < $scope.notifications.length; i++) {
            if ($scope.notifications[i].NotId == id && $scope.notifications[i].Actual == false) {
                return 'notif-actual-false';
            }
        }
    }

    $scope.isActualHide = function (id) {
        for (var i = 0; i < $scope.notifications.length; i++) {
            if ($scope.notifications[i].NotId == id && $scope.notifications[i].Actual == false) {
                return 'check-not-hide';
            }
        }
    }

    $scope.getPath = function (type) {
        switch (type) {
            case 1:
                $state.go('events');
                break;
            case 2:
                $state.go('contacts.recieved');
                break;
            case 3:
                $state.go('contacts.mycontacts');
                break;
        }
    }
});