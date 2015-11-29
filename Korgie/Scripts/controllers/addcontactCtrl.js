korgie.controller('addcontactCtrl', function ($scope, $http, korgieApi, LxDialogService, $state) {
    $scope.email1;
    $scope.email2;

    console.log($state.current.name);

    function addContact(contactEmail) { //продублировать в ивентс контроллер!
        var param, method;
        method = '/Event/AddContact';
        param = {
            email: contactEmail,
        }
        $http.get(method, { params: param }).then(function successCallback(response) {
            getContacts();
            LxDialogService.open('add_ok');
        }, function errorCallback(response) {
            LxDialogService.open('add_failed');
        });
    }

    function openDialog(email, window) {
        $scope.email1 = email;
        LxDialogService.open(window);
    }

    function getContacts() {
        var param, method;
        method = '/Event/GetContacts';
        $http.get(method).then(function successCallback(response) {
            catchContacts(response.data);
        }, function errorCallback(response) {
        });
    }

    function catchContacts(data) {
        korgieApi.contacts = data;
    }

    $scope.add = function () {
        addContact($scope.email1);
    }

});