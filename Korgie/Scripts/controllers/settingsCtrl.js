
korgie.controller('SettingsCtrl', ['$scope', function ($scope) {
    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    }
}]);