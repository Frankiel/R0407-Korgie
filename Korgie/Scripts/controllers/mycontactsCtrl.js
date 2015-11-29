korgie.controller('mycontactsCtrl', function ($scope, $http, korgieApi, LxDialogService) {

    $scope.contacts;
    $scope.nameToDelete;
    $scope.emailToDelete;

    function getContacts() {
        var method;
        method = '/Event/GetContacts';
        $http.get(method).then(function successCallback(response) {
            catchContacts(response.data);
            getContactsFromKorgieAPI();
        }, function errorCallback(response) {
            console.log('getContacts failed from mycontactsCtrl');
        });
    };

    function catchContacts(data) {
        korgieApi.contacts = data;
    };

    function getContactsFromKorgieAPI() {
        $scope.contacts = korgieApi.contacts;
    };

    function deleteContact(contactEmail) {
        var param, method;
        method = '/Event/DeleteContact';
        param = {
            email: contactEmail,
        }
        $http.get(method, { params: param }).then(function successCallback(response) {

        }, function errorCallback(response) {
            console.log('contact deleting failed');
        });
    };

    $(document).off("click", ".delete").on("click", ".delete", function () {
        $scope.nameToDelete = $(this).attr("name");
        $scope.emailToDelete = $(this).attr("email");
        LxDialogService.open('delete');
    });

    $(document).off("click", ".yes").on("click", ".yes", function () {
        deleteContact($scope.emailToDelete);
        for (var i = 0; i < korgieApi.contacts.length; i++) {
            if (korgieApi.contacts[i].PrimaryEmail == $scope.emailToDelete) {
                korgieApi.contacts.splice(i, 1);
                break;
            }
        }
        $scope.nameToDelete = '';
        $scope.emailToDelete = '';
        LxDialogService.close('delete');
        //getContactsFromKorgieAPI();
    });

    getContacts();
});