korgie.controller('mycontactsCtrl', function ($scope, $http, korgieApi, LxDialogService, $state) {

    $scope.contacts;
    $scope.nameToDelete;
    $scope.emailToDelete;

    korgieApi.setCurState('contacts.mycontacts');

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