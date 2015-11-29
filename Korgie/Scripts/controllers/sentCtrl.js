korgie.controller('sentCtrl', function ($scope, $http, korgieApi, $state) {

    $scope.requestsSent;

    korgieApi.setCurState('contacts.sent');

    function getRequests() {
        var param, method;
        method = '/Event/GetRequest';
        $http.get(method).then(function successCallback(response) {
            catchRequests(response.data);
            getRequestsFromKorgieAPI();
        }, function errorCallback(response) {
            console.log('getRequests failed from sentCtrl');
        });
    }

    function catchRequests(data) {
        korgieApi.requestsSent = data;
    }

    function getRequestsFromKorgieAPI() {
        $scope.requests = korgieApi.requestsSent;
    }

    getRequests();

});