korgie.controller('addcontactCtrl', function ($scope, $http, korgieApi, LxDialogService) {
    console.log('addcontactCtrl');
    $scope.email1 = 'dfgdsgfsdgfsd';
    $scope.email2;

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

    $(document).off("click", ".add-contact").on("click", ".add-contact", function () {
        addContact($scope.email1);
        console.log($scope.email1);
    });

});