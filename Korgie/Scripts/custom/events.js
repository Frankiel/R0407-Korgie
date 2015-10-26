var korgie = angular.module('korgie', []);

korgie.controller('EventsCtrl', function ($scope) {
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

    var getWeekDayName = function () {
        var weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return weekDayNames[weekDayNumber];
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
});

korgie
    .filter('monthName', [function () {
        return function (monthNumber) {
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return monthNames[monthNumber];
        }
    }])
    // Future directive is not ready yet
    .directive('dayOfMonth', function () {
        return {
            link: function (scope, element, attrs) {
                /*scope.events = JSON.parse(attrs.events);
                console.log(scope.events);

                console.log(new Date(parseInt("/Date(1445547600000)/".replace("/Date(", "").replace(")/", ""), 10)));*/
            },
            restrict: 'E',
            transclude: true,
            templateUrl: 'Scripts/custom/monthDay.html'
        };
    });;