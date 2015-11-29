korgie.controller('mycontactsCtrl', function ($scope, $http, korgieApi, LxDialogService, $state) {

    $scope.contacts;
    $scope.nameToDelete;
    $scope.emailToDelete;

    korgieApi.setCurState('contacts.mycontacts');

    function getContacts() {
        var param, method;
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

    $scope.delete = function (event) {
        $scope.nameToDelete = $(event.target).attr("name");
        $scope.emailToDelete = $(event.target).attr("email");
        LxDialogService.open('delete');
    };

    $scope.acceptDeleting = function (event) {
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
    };

    getContacts();
});