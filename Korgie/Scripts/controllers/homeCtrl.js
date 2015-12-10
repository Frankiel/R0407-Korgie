korgie.controller('HomeCtrl', function ($scope, $state, korgieApi) {
    $scope.getCurrentState = function (param) {
        var curstate = korgieApi.getCurState();
        if (param == 'contacts.mycontacts' && (curstate == 'contacts.mycontacts' || curstate == 'contacts.addcontact' || curstate == 'contacts.sent' || curstate == 'contacts.recieved')) {
            return 'btn--raised';
        }
        if (param == curstate) {
            if (param == 'settings' || param == 'notifications') {
                return 'btn--fab';
            }
            return 'btn--raised';
        }
        if (param == 'settings' || param == 'notifications') {
            return 'btn--icon';
        }
        return 'btn--flat';
    }

    //setTimeout(function () { console.log($state.current.name);}, 200);

    $('[ui-sref]').click(function () {
        $('.header').removeClass('opened-menu');
        $('.content').removeClass('opened-menu');
        $('.dark-div').removeClass('opened-menu');
    });
});