korgie.controller('sentCtrl', function ($scope, $http, korgieApi) {

    $scope.requestsSent;

    function getRequests() {
        var param, method;
        method = '/Event/GetRequest'; //GetSentRequests
        $http.get(method).then(function successCallback(response) {
            catchRequests(response.data);
            getRequestsFromKorgieAPI();
        }, function errorCallback(response) {
            console.log('getRequests failed from sentCtrl');
        });
         //вернуть в конец successCallback
    }

    function catchRequests(data) { //продублировать в ивентс контроллер!
        korgieApi.requestsSent = data;
    }

    function getRequestsFromKorgieAPI() {
        $scope.requests = korgieApi.requestsSent;
    }

    getRequests();

});