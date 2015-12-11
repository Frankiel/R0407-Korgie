korgie.controller('mycontactsCtrl', function ($scope, $http, korgieApi, LxDialogService, $state) {

    $scope.contacts;
    $scope.nameToDelete;
    $scope.emailToDelete;

    korgieApi.setCurState('contacts.mycontacts');

    //function getContacts() {
    //    var method;
    //    method = '/Event/GetContacts';
    //    $http.get(method).then(function successCallback(response) {
    //        catchContacts(response.data);
    //    }, function errorCallback(response) {
    //        console.log('getContacts failed from mycontactsCtrl');
    //    });
    //};

    //function catchContacts(data) {
    //    $scope.contacts = data;
    //};

    //function deleteContact(contactEmail) {
    //    var param, method;
    //    method = '/Event/DeleteContact';
    //    param = {
    //        email: contactEmail,
    //    }
    //    $http.get(method, { params: param }).then(function successCallback(response) {

    //    }, function errorCallback(response) {
    //        console.log('contact deleting failed');
    //    });
    //};

    $scope.delete = function (index) {
        $scope.nameToDelete = $scope.contacts[index].Name;
        $scope.emailToDelete = $scope.contacts[index].PrimaryEmail;
        LxDialogService.open('delete');
    };

    $scope.acceptDeleting = function (event) {
        korgieApi.deleteContact($scope.emailToDelete).then(function (res) {
            if (res == 'ok') {
                for (var i = 0; i < $scope.contacts.length; i++) {
                    if ($scope.contacts[i].PrimaryEmail == $scope.emailToDelete) {
                        $scope.contacts.splice(i, 1);
                        break;
                    }
                }
                LxDialogService.close('delete');
            }
        });
        
    };

    korgieApi.getContacts().then(function (res) {
        $scope.contacts = res;
    });
});