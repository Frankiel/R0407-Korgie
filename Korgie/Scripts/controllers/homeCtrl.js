korgie.controller('HomeCtrl', function ($scope, $state, korgieApi) {
    //$scope.route = $route;
    //if (korgieApi.state == '')
    //    korgieApi.state = $state.current.name;
    //console.log(korgieApi.state);
    setTimeout(function () { console.log($state.current.name);}, 200);

    //$('[ui-sref]').click(function () {
    //    $('.header').removeClass('opened-menu');
    //    $('.content').removeClass('opened-menu');
    //    $('.dark-div').removeClass('opened-menu');
    //});
});