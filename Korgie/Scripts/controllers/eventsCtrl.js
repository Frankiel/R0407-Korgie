var korgie = angular.module('korgie', ['lumx']);

korgie.controller('EventsCtrl', ['$scope', '$http', '$q', 'korgieApi', 'LxDialogService', '$filter', function ($scope, $http, $q, korgieApi, LxDialogService, $filter) {
    var today = new Date();
    $scope.month = today.getMonth();
    $scope.year = today.getFullYear();
    $scope.events;
    $scope.monthDays;
    $scope.dayToShow;

    $scope.isWeekMode = false;
    $scope.week;
    $scope.weekDays;

    $scope.eventAdding = false;
    $scope.eventEditing = false;
    $scope.eventToEdit;
    $scope.eventToSave;
    
    $scope.types = [{ type: "Sports", color: "" },
        { type: "Work", color: "" },
        { type: "Rest", color: "" },
        { type: "Study", color: "" },
        { type: "Additional", color: "" }];

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
            //добавляем в массив лишь те ивенты, которые идут в текущий день
            var evs = $scope.events.filter(function (ev) {
                var date = ev.Start;
                return date.getMonth() == $scope.month &&
                    date.getDate() == i - firstWeekDay + 1;
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
        return result;
    }
    function getWeekDays(isNextPrev) {
        var result = [];
        var monday;
        if (today.getMonth() == $scope.month && isNextPrev == undefined) {
            var d = today;
            var day = today.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            monday = new Date(d.setDate(diff));
        } else {
            var monday = new Date($scope.year, $scope.month, 1)
            while (monday.getDay() != 1) {
                monday.setDate(monday.getDate() - 1);
            }
        }

        for (var i = 0; i < 7; i++) {
            var evs = $scope.events.filter(function (ev) {
                var date = ev.Start;
                return date.getMonth() == $scope.month && date.getDate() == monday.getDate();
            });
            result.push({
                id: i,
                day: monday.getDate(),
                month: monday.getMonth(),
                year: monday.getFullYear(),
                date: new Date(monday),
                events: evs,
                types: korgieApi.getTypes(evs)
            });
            monday.setDate(monday.getDate() + 1);
        }
        return result;
    }

    function getEvents(isNextPrevWeek) {
        var param, method;
        if (!$scope.isWeekMode) {
            //метод получения ивентов с использованием функции обращения к серверу
            method = '/Event/GetMonthEvents';
            param = {
                month: parseInt($scope.month) + 1,
                year: $scope.year
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                korgieApi.convertEvents(response.data).then(function (events) {
                    $scope.events = events;
                    $scope.monthDays = getMonthDays();
                });
            }, function errorCallback(response) {
                console.log('getting events failed');
            });
        } else {
            method = '/Event/GetWeekEvents',
            param = {
                week: $scope.week,
                year: $scope.year
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                korgieApi.convertEvents(response.data).then(function (events) {
                    $scope.events = events;
                    $scope.weekDays = getWeekDays(isNextPrevWeek);
                });
            }, function errorCallback(response) {
                console.log("getting events failed");
            });
        }
    }
    getEvents();

    $scope.nextMonth = function () {
        if ($scope.month < 11) {
            $scope.month++;
        } else {
            $scope.month = 0;
            $scope.year++;
        }
        getEvents();
    }

    $scope.prevMonth = function () {
        if ($scope.month > 0) {
            $scope.month--;
        } else {
            $scope.month = 11;
            $scope.year--;
        }
        getEvents();
    }

    $scope.changeMonthWeek = function () {
        $scope.isWeekMode = !$scope.isWeekMode;
        $scope.weekDays = getWeekDays();
        $scope.week = korgieApi.getWeekNumber($scope.month, $scope.year);
    }

    $scope.showDay = function (index) {
        if (!$scope.isWeekMode) {
            if ($scope.monthDays[index].month != undefined) {
                $scope.dayToShow = $scope.monthDays[index];
            }
        } else {
            $scope.dayToShow = $scope.weekDays[index];
        }
    }

    $scope.nextDay = function () {
        var dayIndex = $scope.monthDays.indexOf($scope.dayToShow);
        if ($scope.monthDays[dayIndex + 1].month == undefined) {
            $scope.nextMonth();
            $scope.dayToShow = $scope.monthDays[(new Date($scope.year, $scope.month, 1).getDay() + 6) % 7];
        } else {
            $scope.dayToShow = $scope.monthDays[dayIndex + 1];
        }
    }

    $scope.prevDay = function () {
        var dayIndex = $scope.monthDays.indexOf($scope.dayToShow);
        if ($scope.monthDays[dayIndex - 1].month == undefined) {
            $scope.prevMonth();
            var firstDay = (new Date($scope.year, $scope.month, 1).getDay() + 6) % 7;
            var days = 33 - new Date($scope.year, $scope.month, 33).getDate();
            $scope.dayToShow = $scope.monthDays[firstDay + days - 1];
        } else {
            $scope.dayToShow = $scope.monthDays[dayIndex - 1];
        }
    }

    $scope.nextWeek = function () {
        $scope.week++;
        getEvents(true);
    }

    $scope.prevWeek = function () {

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
        // $HTTP
        crudEvent(id);
    };

    var crudEvent = function (oldEventId, newEvent) {
        var date, d;
        if (oldEventId != -1) {
            if ($scope.isWeekMode) {
                $scope.weekDays.forEach(function (day) {
                    day.events.forEach(function (ev, i) {
                        if (ev.EventId == oldEventId) {
                            date = ev.Start.getDate();
                            day.events.splice(i, 1);
                        }
                    })
                });
                d = $scope.weekDays.filter(function (day) {
                    return day.day == date;
                })[0];
            } else {
                $scope.dayToShow.events.forEach(function (ev, i) {
                    if (ev.EventId == oldEventId) {
                        date = ev.Start.getDate();
                        $scope.dayToShow.events.splice(i, 1);
                    }
                });
                d = $scope.monthDays.filter(function (day) {
                    return day.day == date && day.month != undefined;
                })[0];
            }
            d.events.forEach(function (ev, i) {
                if (ev.EventId == oldEventId) {
                    $scope.dayToShow.events.splice(i, 1);
                }
            });
            d.types = korgieApi.getTypes(d.events);
        }

        if (newEvent != undefined) {
            date = newEvent.Start.getDate();
            if ($scope.isWeekMode) {
                var i = 0;
                for (; i < 7 && $scope.weekDays[i].day != newEvent.Start.getDate() ; i++) { }
                d = $scope.weekDays[i];
            } else {
                var i = 0, length = $scope.monthDays.length;
                for (; i < length && !($scope.monthDays[i].day == newEvent.Start.getDate() && $scope.monthDays[i].month != undefined) ; i++) { }
                d = $scope.monthDays[i];
            }
            d.events.push(newEvent);
            d.types = korgieApi.getTypes(d.events);
        }
    }

    $scope.save = function () {
        console.log($scope.eventToEdit);
        $http({
            url: '/Event/SaveEvents',
            method: "GET",
            params: {
                EventId: $scope.eventToEdit.EventId || -1,
                Title: $scope.eventToEdit.Title,
                Start: $scope.eventToEdit.Start,
                Type: $scope.eventToEdit.Type,
                Description: $scope.eventToEdit.Description || '',
                Period: $scope.eventToEdit.Period || 0,
                Days: 0,
                Tags: $scope.eventToEdit.Tags || ''
            }
        });
        crudEvent(!$scope.eventAdding ? $scope.eventToEdit.EventId : -1, $scope.eventToEdit);
        $scope.eventToSave = angular.copy($scope.eventToEdit);
        $scope.showHideControlls();
        $scope.eventAdding = false;
        $scope.eventEditing = false;
    }

    $scope.openDialog = function (dialogName, event) {
        if (event == undefined) {
            $scope.eventAdding = true;
            event = {
                Type: 'Work',
                Start: new Date($scope.dayToShow.year, $scope.dayToShow.month, $scope.dayToShow.day, 0, 0),
                Period: 0
            }
            $scope.eventToEdit = event;
            $scope.eventToSave = event;
            setTimeout(function () {
                $scope.showHideControlls()
            }, 200);
        } else {
            $scope.eventAdding = false;
            $scope.eventEditing = false;
        }
        $scope.eventToSave = event;
        LxDialogService.open(dialogName);
    };

    $scope.closingDialog = function (dialogName) {
        LxDialogService.close(dialogName);
    };

    /*-------------------------------------------------------------------*/

    $scope.cancel = function () {
        $scope.eventToEdit = angular.copy($scope.eventToSave);
        $scope.showHideControlls();
        $scope.eventEditing = false;
        if ($scope.eventAdding) {
            $scope.closingDialog('test');
        }
    };

    $scope.edit = function () {
        $scope.eventEditing = !$scope.eventEditing;
        setTimeout(function () {
            $scope.showHideControlls()
        }, 200);
    }

    $scope.showHideControlls = function () {
        /*$(".controlls-visible").toggle();
        $(".controlls-unvisible").toggle();
        $scope.eventEditing = !$scope.eventEditing;*/
        $scope.eventToEdit = angular.copy($scope.eventToSave);

        var typeButtons = $('.type-click');
        $('[etype="' + $scope.eventToEdit.Type + '"').addClass('btn--raised').removeClass('btn--flat');
        typeButtons.click(function () {
            typeButtons.removeClass('btn--raised');
            $(this).removeClass('btn--flat').addClass('btn--raised');
            $scope.eventToEdit.Type = $(this).attr('etype');
        });

        var periodButtons = $('.period-click');
        $('[period="' + $scope.eventToEdit.Period + '"').addClass('btn--raised').removeClass('btn--flat');
        periodButtons.click(function () {
            periodButtons.removeClass('btn--raised');
            $(this).removeClass('btn--flat').addClass('btn--raised');
            $scope.eventToEdit.Period = $(this).attr('period');
        });
    }

    $scope.people = [
    { name: "Adam", email: "adam@email.com", age: 10 },
    { name: "Amalie", email: "amalie@email.com", age: 12 },
    { name: "Wladimir", email: "wladimir@email.com", age: 30 },
    { name: "Samantha", email: "samantha@email.com", age: 31 },
    { name: "Estefanía", email: "estefanía@email.com", age: 16 },
    { name: "Natasha", email: "natasha@email.com", age: 54 },
    { name: "Nicole", email: "nicole@email.com", age: 43 },
    { name: "Adrian", email: "adrian@email.com", age: 21 }
    ];

    $scope.selects = {
        selectedPerson: undefined
    };
}]);