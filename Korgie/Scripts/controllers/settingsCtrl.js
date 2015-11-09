
korgie.controller('SettingsCtrl', ['$scope', function ($scope) {
    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    }

    $scope.slideWorkColors = function () {
        $('#workcolors').toggleClass('colors-closed');
        $('#sportcolors').addClass('colors-closed');
        $('#relaxingcolors').addClass('colors-closed');
        $('#studyingcolors').addClass('colors-closed');
        $('#additionalcolors').addClass('colors-closed');
    }
    $scope.slideSportColors = function () {
        $('#sportcolors').toggleClass('colors-closed');
        $('#workcolors').addClass('colors-closed');
        $('#relaxingcolors').addClass('colors-closed');
        $('#studyingcolors').addClass('colors-closed');
        $('#additionalcolors').addClass('colors-closed');
    }
    $scope.slideRelaxingColors = function () {
        $('#relaxingcolors').toggleClass('colors-closed');
        $('#sportcolors').addClass('colors-closed');
        $('#workcolors').addClass('colors-closed');
        $('#studyingcolors').addClass('colors-closed');
        $('#additionalcolors').addClass('colors-closed');
    }
    $scope.slideStudyingColors = function () {
        $('#studyingcolors').toggleClass('colors-closed');
        $('#sportcolors').addClass('colors-closed');
        $('#relaxingcolors').addClass('colors-closed');
        $('#workcolors').addClass('colors-closed');
        $('#additionalcolors').addClass('colors-closed');
    }
    $scope.slideAdditionalColors = function () {
        $('#additionalcolors').toggleClass('colors-closed');
        $('#sportcolors').addClass('colors-closed');
        $('#relaxingcolors').addClass('colors-closed');
        $('#studyingcolors').addClass('colors-closed');
        $('#workcolors').addClass('colors-closed');
    }
    $scope.selectWorkColor = function (clr) {
        $('#work').css("background-color", clr);
    }
}]);