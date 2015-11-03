var korgie = angular.module('korgie', ['lumx']);

korgie.controller('EventsCtrl', ['$scope', '$http', '$q', 'korgieApi', 'LxDialogService', function ($scope, $http, $q, korgieApi, LxDialogService) {
    var today = new Date();
    $scope.month = today.getMonth();
    $scope.year = today.getFullYear();
    $scope.events;
    $scope.days;
    $scope.dayToShow;

    function getMonthDays() {
        var result = [];

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
                id: j - 1,
                day: lastDayPrev--,
                month: undefined,
                events: []
            });
        }
        var lastDay = 33 - new Date($scope.year, $scope.month, 33).getDate(), i = firstWeekDay;
        for (; i < lastDay + firstWeekDay; i++) {
            var evs = $scope.events.filter(function (ev) {
                var date = ev.Start;
                return date.getMonth() == $scope.month && date.getDate() == i - firstWeekDay + 1;
            });
            result.push({
                id: i,
                day: i - firstWeekDay + 1,
                month: $scope.month,
                year: $scope.year,
                events: evs,
                types: korgieApi.getTypes(evs)
            });
        }
        for (; i % 7 != 0; i++) {
            result[i] = {
                id: i,
                day: i - lastDay - firstWeekDay + 1,
                events: []
            };
        }
        console.log(result);
        return result;
    }

    $http.get('/WebSite/GetEvents', { params: { month: parseInt($scope.month) + 1, year: $scope.year } }).then(function successCallback(response) {
        korgieApi.convertEvents(response.data).then(function (events) {
            $scope.events = events;
            $scope.days = getMonthDays();
        });
    }, function errorCallback(response) {
        console.log('getting events failed');
    });

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

    $scope.showDay = function (index) {
        if ($scope.days[index].month != undefined) {
            $scope.dayToShow = $scope.days[index];
        }
    }

    $scope.showTypeEvents = function (type) {
        console.log(type);

        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    }

    $scope.nextDay = function () {
        var dayIndex = $scope.days.indexOf($scope.dayToShow);
        if ($scope.days[dayIndex + 1].month == undefined) {
            $scope.nextMonth();
            $scope.dayToShow = $scope.days[(new Date($scope.year, $scope.month, 1).getDay() + 6) % 7];
        } else {
            $scope.dayToShow = $scope.days[dayIndex + 1];
        }
    }

    $scope.prevDay = function () {
        var dayIndex = $scope.days.indexOf($scope.dayToShow);
        if ($scope.days[dayIndex - 1].month == undefined) {
            $scope.prevMonth();
            var firstDay = (new Date($scope.year, $scope.month, 1).getDay() + 6) % 7;
            var days = 33 - new Date($scope.year, $scope.month, 33).getDate();
            $scope.dayToShow = $scope.days[firstDay + days - 1];
        } else {
            $scope.dayToShow = $scope.days[dayIndex - 1];
        }
    }

    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    }

    $scope.closeDayMode = function () {
        $scope.dayToShow = undefined;
    }

    $scope.deleteEvent = function (id) {
        var date;
        $scope.dayToShow.events.forEach(function (ev, i) {
            if (ev.EventId == id) {
                date = ev.Start.getDate();
                $scope.dayToShow.events.splice(i, 1);
            }
        });
        var d = $scope.days.filter(function (day) {
            return day.day == date && day.month != undefined;
        })[0];
        d.events.forEach(function (ev, i) {
            if (ev.EventId == id) {
                $scope.dayToShow.events.splice(i, 1);
            }
        });
        d.types = korgieApi.getTypes(d.events);
    };

    $scope.openDialog = function (dialogId) {
        LxDialogService.open(dialogId);
    };

    $scope.closingDialog = function () {
        LxNotificationService.info('Dialog closed!');
    };

    /*-------------------------------------------------------------------*/
    $scope.eventToEdit = {
        EventId: 5,
        Title: "Tidghnhdgnhdgngtle",
        Start: new Date(),
        Time: "11:30",
        End: new Date(),
        Type: "sport",
        Description: "gtyjtyjdhywmnyhnkl mrt sgjnm ,hh r tnj;hnjkm, jnhoklm ,yhkm,yhtojk m,r6ukm, ykm,yhnjikm 5yhting jkm.5y htog; jnkm. yh tm,ht gok;nm,yhtkm, ehtnd tvu oybmktu chjnkmuvibh njkfsdf",
        Period: 0,

        Repeat: [false, false, false, false, false, false, false],
        Tags: "Tags"
    };
    console.log($scope.eventToEdit);


    $scope.showHideControlls = function () {
        $(".controllsVisible").toggle();
        $(".controllsUnvisible").toggle();
    }



}]);