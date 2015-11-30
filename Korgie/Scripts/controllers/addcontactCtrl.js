korgie.controller('addcontactCtrl', function ($scope, $http, korgieApi, LxDialogService, $state, $q) {
    $scope.email1;
    $scope.email2;
    $scope.myemail;

    $scope.contacts;
    $scope.requestsSent;
    $scope.myRequests;

    korgieApi.setCurState('contacts.addcontact');

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
            LxDialogService.open('add_failed'); //CRIT
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
        $scope.contacts = data;
    }

    function getRequests() {
        var param, method;
        method = '/Event/GetRequest';
        $http.get(method).then(function successCallback(response) {
            catchRequests(response.data);
        }, function errorCallback(response) {
            console.log('getRequests failed from sentCtrl');
        });
    }

    function catchRequests(data) {
        $scope.requestsSent = data;
    }

    function getRequestsRecieved() {
        var param, method;
        method = '/Event/GetMyRequests';
        $http.get(method).then(function successCallback(response) {
            catchMyRequests(response.data);
        }, function errorCallback(response) {
            console.log('getRequests failed from sentCtrl');
        });
    }

    function catchMyRequests(data) {
        $scope.myRequests = data;
    }

    function getProfileInfo() {
        var param, method;
        method = '/Event/GetProfileInfo';
        $http.get(method).then(function successCallback(response) {
            catchProfileInfo(response.data);
        }, function errorCallback(response) {
            console.log('getProfileInfo failed from settingsCtrl');
        });
    }

    function catchProfileInfo(data) {
        $scope.myemail = data.PrimaryEmail;
    }

    function isFriend(email) {
        for (var i = 0; i < $scope.contacts.length; i++) {
            if ($scope.contacts[i].PrimaryEmail == email) {
                return true;
            }
        }
        return false;
    }

    function isSent(email) {
        for (var i = 0; i < $scope.requestsSent.length; i++) {
            if ($scope.requestsSent[i].To == email && $scope.requestsSent[i].State == 'Sent') {
                return true;
            }
        }
        return false;
    }

    function isGot(email) {
        for (var i = 0; i < $scope.myRequests.length; i++) {
            if ($scope.myRequests[i].From == email) {
                return true;
            }
        }
        return false;
    }

    function isMe(email) {
        if ($scope.myemail == email) {
            return true;
        }
        return false;
    }

    function isUser(contactEmail) { //продублировать в ивентс контроллер!
        var defered = $q.defer();
        var param, method;
        method = '/Event/IsUser';
        param = {
            email: contactEmail,
        }
        $http.get(method, { params: param }).then(function successCallback(response) {
            defered.resolve();
        }, function errorCallback(response) {
            defered.reject();
        });
        return defered.promise;
    }

    getContacts();
    getRequests();
    getRequestsRecieved();
    getProfileInfo();

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
            isUser($scope.email1).then(function () {
                addContact($scope.email1);
            }, function () { LxDialogService.open('add_failed'); });
        }
    }

});