var korgie = angular.module('korgie', []);

korgie.controller('EventsCtrl', ['$scope', '$http', '$q', function ($scope, $q) {
    $scope.month;
    $scope.year;
    $scope.days;

    var today = new Date();
    $scope.month = today.getMonth();
    $scope.year = today.getFullYear();
    $scope.days = getMonthDays();

    function getMonthDays() {
        var result = new Array();

        var prevMonth, prevYear;
        if ($scope.month > -1) {
            prevMonth = $scope.month - 1;
            prevYear = $scope.year;
        } else {
            prevMonth = 11
            prevYear = $scope.year - 1;
        }
        var firstWeekDay = (new Date($scope.year, $scope.month, 1).getDay() + 6) % 7;

        var lastDayPrev = 33 - new Date(prevYear, prevMonth, 33).getDate();
        for (var j = firstWeekDay; j > 0; j--) {
            result.unshift({
                day: lastDayPrev--
            });
        }
        var lastDay = 33 - new Date($scope.year, $scope.month, 33).getDate(), i = firstWeekDay;
        for (; i < lastDay + firstWeekDay; i++) {
            result.push({
                day: i - firstWeekDay + 1,
                month: $scope.month,
                year: $scope.year
            });
        }
        for (; i % 7 != 0; i++) {
            result[i] = {
                day: i - lastDay - firstWeekDay + 1
            };
        }
        return result;
    }

    $scope.nextMonth = function () {
        if ($scope.month < 11) {
            $scope.month++;
        } else {
            $scope.month = 0;
            $scope.year++;
        }
        $scope.days = getMonthDays();
    }

    $scope.prevMonth = function () {
        if ($scope.month > 0) {
            $scope.month--;
        } else {
            $scope.month = 11;
            $scope.year--;
        }
        $scope.days = getMonthDays();
    }
}]);