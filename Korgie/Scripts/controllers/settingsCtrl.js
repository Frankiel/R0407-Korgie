
korgie.controller('settingsCtrl', function ($scope , $http, korgieApi) {
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

    //метод для закрытия колорпикера при нажатии на body
$(document).on("click", ".color-button", function () {
    $(this).parent().prev().children().removeClass("btn--blue btn--red btn--purple btn--green btn--yellow btn--orange btn--teal btn--pink btn--grey"); //снимаю все цвета с кнопки типа
    var className = $(this).attr('class');
    $(this).parent().prev().children().addClass(className);
    $(this).parent().prev().children().removeClass("color-button");
    $(this).parent().addClass('colors-closed');
        switch ($(this).parent().prev().children().attr('id')) {
            case 'work':
                korgieApi.work.Color = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                $(this).addClass(className);
                console.log(korgieApi.work.Color);
                break;
            case 'study':
                korgieApi.study.Color = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                $(this).addClass(className);
                console.log(korgieApi.study.Color);
                break;
            case 'sport':
                korgieApi.sport.Color = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                $(this).addClass(className);
                console.log(korgieApi.sport.Color);
                break;
            case 'rest':
                korgieApi.rest.Color = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                $(this).addClass(className);
                console.log(korgieApi.rest.Color);
                break;
            case 'additional':
                korgieApi.additional.Color = $(this).removeClass('btn btn--s btn--fab color-button').attr('class');
                $(this).addClass(className);
                console.log(korgieApi.additional.Color);
                break;
        }
});

    function getProfileInfo() { //без параметров, потому что в функции на сервере frank проверит cookies и выдаст инфо для конкретного юзера по мылу
        var param, method;
        method = '/Event/GetProfileInfo';//FRANK должен получить экземпляр класса User
        $http.get(method).then(function successCallback(response) {
            catchProfileInfo(response.data);
        }, function errorCallback(response) {
            console.log('getting profile info failed');
        });
    }

    function catchProfileInfo(data) {
        korgieApi.name = data.Name;
        korgieApi.primaryEmail = data.Name;
        korgieApi.additionalEmail = data.AdditionalEmail;
        korgieApi.phone = data.Phone;
        korgieApi.country = data.Country;
        korgieApi.city = data.City;
        korgieApi.sport = data.Sport;
        korgieApi.work = data.Work;
        korgieApi.rest = data.Rest;
        korgieApi.study = data.Study;
        korgieApi.additional = data.Additional;
    }

    function saveProfileInfo() {
        var param, method;
        method = '/Event/SaveProfileInfo'; //FRANK
        param = {//FRANK
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
    }

    getProfileInfoFromKorgieAPI();

    $(document).on("click", ".type-button", function () {
        if ($(this).parent().next().css('visibility') != 'hidden') {
            $(this).parent().next().addClass('colors-closed');
        }
        else {
            $('.selecteventcolor').addClass('colors-closed');
            $(this).parent().next().toggleClass('colors-closed');
        }
    });
});


