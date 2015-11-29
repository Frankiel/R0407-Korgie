korgie.controller('recievedCtrl', function ($scope, $http, korgieApi, LxDialogService, $state) {
    $scope.requests;

    korgieApi.setCurState('contacts.recieved');

    function getRequests() {
        var param, method;
        method = '/Event/GetMyRequests';
        $http.get(method).then(function successCallback(response) {
            catchRequests(response.data);
        }, function errorCallback(response) {
            console.log('getRequests failed from sentCtrl');
        });
    }

    function catchRequests(data) {
        $scope.requests = data;
    }

    function acceptContact(email) {
        var param, method;
        method = '/Event/AcceptRequest';
        param = {
            emailcontact: email,
        }
        $http.get(method, { params: param }).then(function successCallback(response) {

        }, function errorCallback(response) {
            console.log('accepting failed');
        });
    }

    function rejectContact(email) {
        var param, method;
        method = '/Event/RejectRequest';
        param = {
            emailcontact: email,
        }
        $http.get(method, { params: param }).then(function successCallback(response) {

        }, function errorCallback(response) {
            console.log('rejecting failed');
        });
    }

    $scope.accept = function (index) {
        $scope.emailToAccept = $scope.requests[index].From;
        LxDialogService.open('accept');
    };

    $scope.reject = function (index) {
        $scope.emailToReject = $scope.requests[index].From;
        LxDialogService.open('reject');
    };

    $scope.accepting = function (event) {
        acceptContact($scope.emailToAccept);
        for (var i = 0; i < $scope.requests.length; i++) {
            if ($scope.requests[i].From == $scope.emailToAccept) {
                $scope.requests.splice(i, 1);
                break;
            }
        }
        LxDialogService.close('accept');
    };

    $scope.rejecting = function (event) {
        acceptContact($scope.emailToReject);
        for (var i = 0; i < $scope.requests.length; i++) {
            if ($scope.requests[i].From == $scope.emailToReject) {
                $scope.requests.splice(i, 1);
                break;
            }
        }
        LxDialogService.close('reject');
    };

    getRequests();

});