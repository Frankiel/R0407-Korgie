korgie.controller('sentCtrl', function ($scope, $http, korgieApi, $state) {

    $scope.requests;

    korgieApi.setCurState('contacts.sent');

    korgieApi.getRequests().then(function (res) {
        $scope.requests = res;
    });
});