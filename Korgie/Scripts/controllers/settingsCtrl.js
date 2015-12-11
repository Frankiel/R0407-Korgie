
korgie.controller('settingsCtrl', function ($scope, korgieApi, $state) {

    korgieApi.setCurState('settings');

    $scope.name;
    $scope.primaryEmail;
    $scope.additionalEmail;
    $scope.phone;
    $scope.country;
    $scope.city;
    $scope.types;
    $scope.typesIcons = ['mdi-briefcase', 'mdi-book-open', 'mdi-dumbbell', 'mdi-beach', 'mdi-plus'];
    $scope.colors = ['btn--blue', 'btn--red', 'btn--purple', 'btn--green', 'btn--yellow', 'btn--orange', 'btn--teal', 'btn--pink', 'btn--grey'];

    $scope.showHideMenu = function () {
        korgieApi.showHideMenu();
    }

    $scope.slideColors = function (clickEvent) {
        var panel;
        if ($(clickEvent.target).context.tagName == 'I') {
            panel = $(clickEvent.target).parent().parent().next();
        }
        else{
            panel = $(clickEvent.target).parent().next();
        }
        if (panel.css('visibility') != 'hidden') {
            panel.addClass('colors-closed');
        }
        else {
            $('.selecteventcolor').addClass('colors-closed');
            panel.removeClass('colors-closed');
        }
    }

    $scope.setColor = function (clickEvent) {
        var thisbutton = $(clickEvent.target);
        var typebutton = thisbutton.parent().prev().children();
        typebutton.removeClass(typebutton.attr('color'));
        typebutton.addClass(thisbutton.attr('color'));
        typebutton.attr('color', thisbutton.attr('color'));
        thisbutton.parent().addClass('colors-closed');
        var ind = typebutton.attr('id');
        $scope.types[ind][1] = typebutton.attr('color');
        $scope.types[ind][2] = korgieApi.rgb2hex(typebutton.css('background-color'));
        saveProfileInfo();
    }

    function saveProfileInfo() {
        korgieApi.saveProfileInfo($scope.name, $scope.primaryEmail, $scope.additionalEmail, $scope.phone, $scope.country, $scope.city, $scope.types);
    }

    korgieApi.getProfileInfo().then(function () {
        $scope.name = korgieApi.name;
        $scope.primaryEmail = korgieApi.primaryEmail;
        $scope.additionalEmail = korgieApi.additionalEmail;
        $scope.phone = korgieApi.phone;
        $scope.country = korgieApi.country;
        $scope.city = korgieApi.city;
        $scope.types = [korgieApi.work, korgieApi.study, korgieApi.sport, korgieApi.rest, korgieApi.additional];
    });
});


