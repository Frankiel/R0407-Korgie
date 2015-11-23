
korgie.controller('settingsCtrl', function ($scope, $http, korgieApi) {
    console.log("Initializing settingsCtrl");
    $scope.name;
    $scope.primaryEmail;
    $scope.additionalEmail;
    $scope.phone;
    $scope.country;
    $scope.city;
    $scope.sport;
    $scope.work;
    $scope.rest;
    $scope.study;
    $scope.additional;


    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    }

    $(document).off("click", ".color-button").on("click", ".color-button", function () {
        console.log('color button click menu');
        $(this).parent().prev().children().removeClass("btn--blue btn--red btn--purple btn--green btn--yellow btn--orange btn--teal btn--pink btn--grey"); //снимаю все цвета с кнопки типа
        var className = $(this).attr('class');
        $(this).parent().prev().children().addClass(className);
        $(this).parent().prev().children().removeClass("color-button");
        $(this).parent().addClass('colors-closed');
        switch ($(this).parent().prev().children().attr('id')) {
            case 'work':
                korgieApi.work[1] = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                korgieApi.work[2] = korgieApi.rgb2hex($(this).parent().prev().children().css('background-color'));
                $scope.work = korgieApi.work;
                $(this).addClass(className);
                console.log(korgieApi.work[1]);
                break;
            case 'study':
                korgieApi.study[1] = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                korgieApi.study[2] = korgieApi.rgb2hex($(this).parent().prev().children().css('background-color'));
                $scope.study = korgieApi.study;
                $(this).addClass(className);
                console.log(korgieApi.work[1]);
                break;
            case 'sport':
                korgieApi.sport[1] = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                korgieApi.sport[2] = korgieApi.rgb2hex($(this).parent().prev().children().css('background-color'));
                $scope.sport = korgieApi.sport;
                $(this).addClass(className);
                console.log(korgieApi.work[1]);
                break;
            case 'rest':
                korgieApi.rest[1] = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                korgieApi.rest[2] = korgieApi.rgb2hex($(this).parent().prev().children().css('background-color'));
                $scope.rest = korgieApi.rest;
                $(this).addClass(className);
                console.log(korgieApi.work[1]);
                break;
            case 'additional':
                korgieApi.additional[1] = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                korgieApi.additional[2] = korgieApi.rgb2hex($(this).parent().prev().children().css('background-color'));
                $scope.additional = korgieApi.additional;
                $(this).addClass(className);
                console.log(korgieApi.work[1]);
                break;
        }
        saveProfileInfo();
    });

    function getProfileInfo() {
        var param, method;
        method = '/Event/GetProfileInfo';
        $http.get(method).then(function successCallback(response) {
            catchProfileInfo(response.data);
            console.log('getProfileInfo done from settingsCtrl');
            getProfileInfoFromKorgieAPI();
        }, function errorCallback(response) {
            console.log('getProfileInfo failed from settingsCtrl');
        });
    }

    function catchProfileInfo(data) {
        console.log('start catchProfileInfo from settingsCtrl');
        korgieApi.name = data.Name;
        korgieApi.primaryEmail = data.PrimaryEmail;
        korgieApi.additionalEmail = data.AdditionalEmail;
        korgieApi.phone = data.Phone;
        korgieApi.country = data.Country;
        korgieApi.city = data.City;
        if (data.Sport.length == 3)
            korgieApi.sport = data.Sport;
        if (data.Work.length == 3)
            korgieApi.work = data.Work;
        if (data.Rest.length == 3)
            korgieApi.rest = data.Rest;
        if (data.Study.length == 3)
            korgieApi.study = data.Study;
        if (data.Additional.length == 3)
            korgieApi.additional = data.Additional;
        console.log('end catchProfileInfo from settingsCtrl');
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
            Sport: korgieApi.sport,
            Work: korgieApi.work,
            Rest: korgieApi.rest,
            Study: korgieApi.study,
            Additional: korgieApi.additional
        }
        $http.get(method, { params: param }).then(function successCallback(response) {
            console.log('profile info saved!');
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
        $scope.sport = korgieApi.sport;
        $scope.work = korgieApi.work;
        $scope.rest = korgieApi.rest;
        $scope.study = korgieApi.study;
        $scope.additional = korgieApi.additional;
        console.log($scope.name); //запускается перед getProfileInfo()
    }

    getProfileInfo()
    //getProfileInfoFromKorgieAPI();

    function Slide(){
        console.log('Sliding menu');
        if ($(this).parent().next().css('visibility') != 'hidden') {
            $(this).parent().next().addClass('colors-closed');
        }
        else {
            $('.selecteventcolor').addClass('colors-closed');
            $(this).parent().next().removeClass('colors-closed');
        }
    }

    $(document).off("click", ".type-button").on("click", ".type-button", Slide);

        
});


