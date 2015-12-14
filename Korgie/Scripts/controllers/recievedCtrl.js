korgie.controller('recievedCtrl', function ($scope, $http, korgieApi, LxDialogService, $state) {
    $scope.requests;

    korgieApi.setCurState('contacts.recieved');

    $scope.accept = function (index) {
        $scope.emailToAccept = $scope.requests[index].From;
        LxDialogService.open('accept');
    };

    $scope.reject = function (index) {
        $scope.emailToReject = $scope.requests[index].From;
        LxDialogService.open('reject');
    };

    $scope.accepting = function (event) {
        korgieApi.acceptContact($scope.emailToAccept).then(function (res) {
            if (res == 'ok') {
                for (var i = 0; i < $scope.requests.length; i++) {
                    if ($scope.requests[i].From == $scope.emailToAccept) {
                        $scope.requests.splice(i, 1);
                        break;
                    }
                }
                LxDialogService.close('accept');
            }
        });
    };

    $scope.rejecting = function (event) {
        korgieApi.rejectContact($scope.emailToReject).then(function (res) {
            if (res == 'ok') {
                for (var i = 0; i < $scope.requests.length; i++) {
                    if ($scope.requests[i].From == $scope.emailToReject) {
                        $scope.requests.splice(i, 1);
                        break;
                    }
                }
                LxDialogService.close('reject');
            }
        });
    };

    korgieApi.getRequestsRecieved().then(function (res) {
        $scope.requests = res;
    });
});