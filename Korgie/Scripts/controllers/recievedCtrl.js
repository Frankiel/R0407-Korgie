korgie.controller('recievedCtrl', function ($scope, $http, korgieApi) {

    $scope.requests;

    function getRequests() {
        var param, method;
        method = '/Event/GetRequest'; //GetMyRequests
        $http.get(method).then(function successCallback(response) {
            catchRequests(response.data);
        }, function errorCallback(response) {
            console.log('getRequests failed from sentCtrl');
        });
        //вернуть в конец successCallback
    }

    function catchRequests(data) { //продублировать в ивентс контроллер!
        $scope.requests = data;
    }

    function acceptContact(contactEmail) {
        var param, method;
        method = '/Event/AcceptContact';
        param = {
            email: contactEmail,
        }
        $http.get(method, { params: param }).then(function successCallback(response) {

        }, function errorCallback(response) {
            console.log('accepting failed');
        });
    }

    function rejectContact(contactEmail) {
        var param, method;
        method = '/Event/RejectContact';
        param = {
            email: contactEmail,
        }
        $http.get(method, { params: param }).then(function successCallback(response) {

        }, function errorCallback(response) {
            console.log('rejecting failed');
        });
    }

    getRequests();

});