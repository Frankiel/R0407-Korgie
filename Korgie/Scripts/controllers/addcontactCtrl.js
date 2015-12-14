korgie.controller('addcontactCtrl', function ($scope, korgieApi, LxDialogService, $state, $q) {
    $scope.email1;
    $scope.email2;
    $scope.tempemail1;
    $scope.tempemail2;
    $scope.myemail;

    $scope.contacts;
    $scope.requestsSent;
    $scope.myRequests;

    korgieApi.setCurState('contacts.addcontact');

    function isFriend(email) {
        for (var i = 0; i < $scope.contacts.length; i++) {
            if ($scope.contacts[i].PrimaryEmail == email) {
                return true;
            }
        }
        return false;
    };

    function isSent(email) {
        for (var i = 0; i < $scope.requestsSent.length; i++) {
            if ($scope.requestsSent[i].To == email && $scope.requestsSent[i].State == 'Sent') {
                return true;
            }
        }
        return false;
    };

    function isGot(email) {
        for (var i = 0; i < $scope.myRequests.length; i++) {
            if ($scope.myRequests[i].From == email) {
                return true;
            }
        }
        return false;
    };

    function isMe(email) {
        if ($scope.myemail == email) {
            return true;
        }
        return false;
    };

    korgieApi.getContacts().then(function (res) {
        $scope.contacts = res;
    });
    korgieApi.getRequests().then(function (res) {
        $scope.requestsSent = res;
    });
    korgieApi.getRequestsRecieved().then(function (res) {
        $scope.myRequests = res;
    });
    korgieApi.getProfileInfo().then(function () {
        $scope.myemail = korgieApi.primaryEmail;
    });

    $scope.add = function () {
        if (isFriend($scope.email1)) {
            LxDialogService.open('already_friend');
        }
        else if (isSent($scope.email1)) {
            LxDialogService.open('already_sent');
        }
        else if (isGot($scope.email1)) {
            LxDialogService.open('already_got');
        }
        else if (isMe($scope.email1)) {
            LxDialogService.open('add_failed');
        }
        else {
            korgieApi.isUser($scope.email1).then(function (result) {
                if (result == "True") {
                    korgieApi.addContact($scope.email1).then(function (res) {
                        if (res == 'ok') {
                            korgieApi.getContacts().then(function (res) {
                                $scope.contacts = res;
                            });
                            LxDialogService.open('add_ok');
                        }
                        else {
                            LxDialogService.open('add_failed');
                        }
                    });
                }
                else {
                    LxDialogService.open('add_failed');
                }
            });
        }
    };

    $scope.invite = function () {
        if (isFriend($scope.email2)) {
            LxDialogService.open('invite_friend');
        }
        else if (isMe($scope.email2)) {
            LxDialogService.open('invite_failed');
        }
        else {
            korgieApi.isUser($scope.email2).then(function (result) {
                if (result == "True") {
                    LxDialogService.open('invite_isuser');
                }
                else {
                    korgieApi.isInvited($scope.email2).then(function (result) {
                        if (result == "True") {
                            LxDialogService.open('invite_sent');
                        }
                        else {
                            korgieApi.inviteContact($scope.email2).then(function (res) {
                                if (res == 'ok') {
                                    LxDialogService.open('invite_ok');
                                }
                                else {
                                    LxDialogService.open('invite_failed');
                                }
                            });
                        }
                    });
                }
            });
        }
    };

    $scope.closingDialog = function () {
        $scope.email2 = '';
        $scope.email1 = '';
    }

});