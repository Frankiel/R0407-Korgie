korgie.controller('contactsCtrl', function ($scope, $http, korgieApi) {
    console.log("Initializing contactsCtrl");
    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    }
});