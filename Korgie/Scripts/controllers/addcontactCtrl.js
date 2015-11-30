﻿korgie.controller('addcontactCtrl', function ($scope, $http, korgieApi, LxDialogService, $state) {
    $scope.email1;
    $scope.email2;

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
            if ($scope.requestsSent[i].To == email) {
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

    function isUser(contactEmail) { //продублировать в ивентс контроллер!
        var param, method;
        method = '/Event/IsUser';
        param = {
            email: contactEmail,
        }
        $http.get(method, { params: param }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            return false;
        });
    }

    getContacts();
    getRequests();
    getRequestsRecieved();

    $scope.add = function () {
        if (isFriend($scope.email1)) {
            LxDialogService.open('already_friend');
        }
        else if (isSent($scope.email1)) {
            LxDialogService.open('already_sent');
        }
        else if (isGot($scope.email1)) {
            LxDialogService.open('already_got');
        } else if (isUser($scope.email1)) {
            addContact($scope.email1);
        } else {
            LxDialogService.open('add_failed');
        }
    }

});