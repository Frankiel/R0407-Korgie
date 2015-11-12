
korgie.controller('settingsCtrl', function ($scope) {
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
    //метод для закрытия колорпикера при нажатии на body
});

$(document).on("click", ".color-button", function () {
    $(this).parent().prev().children().removeClass("btn--blue btn--red btn--purple btn--green btn--yellow btn--orange btn--teal btn--pink btn--grey"); //снимаю все цвета с кнопки типа
    var className = $(this).attr('class');
    $(this).parent().prev().children().addClass(className);
    $(this).parent().prev().children().removeClass("color-button");
    $(this).parent().addClass('colors-closed');
});

$(".set").on("click", ".set", function () {
    $('#additionalcolors').addClass('colors-closed');
    $('#sportcolors').addClass('colors-closed');
    $('#relaxingcolors').addClass('colors-closed');
    $('#studyingcolors').addClass('colors-closed');
    $('#workcolors').addClass('colors-closed');
});
