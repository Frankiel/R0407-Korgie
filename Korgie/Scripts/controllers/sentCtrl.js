korgie.controller('sentCtrl', function ($scope, $http, korgieApi, $state) {

    $scope.requests;

    korgieApi.setCurState('contacts.sent');

    //function getRequests() {
    //    var param, method;
    //    method = '/Event/GetRequest';
    //    $http.get(method).then(function successCallback(response) {
    //        catchRequests(response.data);
    //    }, function errorCallback(response) {
    //        console.log('getRequests failed from sentCtrl');
    //    });
    //}

    //function catchRequests(data) {
    //    $scope.requests = data;
    //}

    korgieApi.getRequests().then(function (res) {
        $scope.requests = res;
    });

});