
korgie.controller('settingsCtrl', function ($scope, $http, korgieApi, $state) {

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
        $scope.name = data.Name;
        $scope.primaryEmail = data.PrimaryEmail;
        $scope.additionalEmail = data.AdditionalEmail;
        $scope.phone = data.Phone;
        $scope.country = data.Country;
        $scope.city = data.City;
        $scope.types = [data.Work, data.Study, data.Sport, data.Rest, data.Additional];
    }


    function saveProfileInfo() {
        var param, method;
        method = '/Event/SaveProfileInfo';
        param = {
            Name: $scope.name,
            PrimaryEmail: $scope.primaryEmail,
            AdditionalEmail: $scope.additionalEmail,
            Phone: $scope.phone,
            Country: $scope.country,
            City: $scope.city,
            Sport: $scope.types[2],
            Work: $scope.types[0],
            Rest: $scope.types[3],
            Study: $scope.types[1],
            Additional: $scope.types[4]
        }
        $http.get(method, { params: param }).then(function successCallback(response) {
        }, function errorCallback(response) {
            console.log('profile info saving failed');
        });
    }

    getProfileInfo();
});


