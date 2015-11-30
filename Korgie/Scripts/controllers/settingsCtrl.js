
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
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
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
        korgieApi.types[ind][1] = typebutton.attr('color');
        korgieApi.types[ind][2] = korgieApi.rgb2hex(typebutton.css('background-color'));
        $scope.types[ind] = korgieApi.types[ind];
        saveProfileInfo();
    }

    function getProfileInfo() {
        var param, method;
        method = '/Event/GetProfileInfo';
        $http.get(method).then(function successCallback(response) {
            catchProfileInfo(response.data);
            getProfileInfoFromKorgieAPI();
        }, function errorCallback(response) {
            console.log('getProfileInfo failed from settingsCtrl');
        });
    }

    function catchProfileInfo(data) {
        korgieApi.name = data.Name;
        korgieApi.primaryEmail = data.PrimaryEmail;
        korgieApi.additionalEmail = data.AdditionalEmail;
        korgieApi.phone = data.Phone;
        korgieApi.country = data.Country;
        korgieApi.city = data.City;
        korgieApi.types = [data.Work, data.Study, data.Sport, data.Rest, data.Additional];
    }


    function saveProfileInfo() {
        var param, method;
        method = '/Event/SaveProfileInfo';
        param = {
            Name: korgieApi.name,
            PrimaryEmail: korgieApi.primaryEmail,
            AdditionalEmail: korgieApi.additionalEmail,
            Phone: korgieApi.phone,
            Country: korgieApi.country,
            City: korgieApi.city,
            Sport: korgieApi.types[2],
            Work: korgieApi.types[0],
            Rest: korgieApi.types[3],
            Study: korgieApi.types[1],
            Additional: korgieApi.types[4]
        }
        $http.get(method, { params: param }).then(function successCallback(response) {
        }, function errorCallback(response) {
            console.log('profile info saving failed');
        });
    }

    function getProfileInfoFromKorgieAPI() {
        $scope.name = korgieApi.name;
        $scope.primaryEmail = korgieApi.primaryEmail;
        $scope.additionalEmail = korgieApi.additionalEmail;
        $scope.phone = korgieApi.phone;
        $scope.country = korgieApi.country;
        $scope.city = korgieApi.city;
        $scope.types = korgieApi.types;
    }

    getProfileInfo();
});


