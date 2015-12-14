korgie.controller('HomeCtrl', function ($scope, $state, korgieApi) {
    $scope.notify = '';
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

    korgieApi.getProfileInfo().then(function () {
        $scope.name = korgieApi.name;
    });

    $scope.isActualNot = function () {
        korgieApi.checkActualNotify().then(function (result) {
            if (result == "True") {
                $scope.notify = 'notify-isactual';
            }
        });
        return $scope.notify;
    };

    $('[ui-sref]').click(function () {
        $('.header').removeClass('opened-menu');
        $('.content').removeClass('opened-menu');
        $('.dark-div').removeClass('opened-menu');
    });
});