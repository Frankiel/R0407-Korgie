korgie.controller('contactsCtrl', function ($scope, $http, korgieApi) {
    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    }
});