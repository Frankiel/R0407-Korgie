korgie.controller('contactsCtrl', function ($scope, $http, korgieApi) {

    $scope.getCurrentState = function (param) {
        if (param == korgieApi.getCurState()) {
            return 'btn--raised';
        }
        return 'btn--flat';
    }

    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    }


});