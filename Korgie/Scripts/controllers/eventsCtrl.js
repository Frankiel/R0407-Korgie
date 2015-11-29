var korgie = angular.module('korgie', ['lumx', 'ui.router']);

korgie.controller('eventsCtrl', function ($scope, $http, $q, korgieApi, LxDialogService, $filter, $state) {

    console.log($state.current.name);

    var today = new Date();
    $scope.month = today.getMonth();
    $scope.year = today.getFullYear();
    var events = [], todos = [];
    $scope.monthDays;
    $scope.dayToShow;

    $scope.isWeekMode = false;
    $scope.week;
    $scope.weekDays;

    $scope.eventAdding = false;
    $scope.eventEditing = false;
    $scope.eventToEdit;
    $scope.eventToSave;
    $scope.todoToEdit;
    $scope.todoToSave;

    // STUB!
    $scope.eventContacts = [];

    $scope.contacts;

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
            var evs = events.filter(function (ev) {
                var date = ev.Start;
                return date.getMonth() == $scope.month &&
                    date.getDate() == i - firstWeekDay + 1;
            });
            var tds = todos.filter(function (td) {
                var date = td.Start;
                return date.getMonth() == $scope.month &&
                    date.getDate() == i - firstWeekDay + 1;
            });
            result.push({
                id: i,
                day: i - firstWeekDay + 1,
                month: $scope.month,
                year: $scope.year,
                events: evs,
                types: korgieApi.getTypes(evs),
                todos: tds
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
    };
    function getWeekDays(isNextPrev) {
        var result = [];
        var monday;
        if (today.getMonth() == $scope.month && isNextPrev == undefined) {
            var d = today;
            var day = today.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            monday = new Date(d.setDate(diff));
        } else {
            if (isNextPrev > 0) {
                var sun = $scope.weekDays[6].date;
                sun.setDate(sun.getDate() + 1);
                monday = sun;
            } else if (isNextPrev < 0) {
                var mon = $scope.weekDays[0].date;
                mon.setDate(mon.getDate() - 7);
                monday = mon;
            } else {
                var month4 = new Date($scope.year, $scope.month, 4), k;
                if (month4.getDay() < 4) {
                    k = (8 - month4.getDay()) % 7;
                } else {
                    k = 0 - (month4.getDay() - 1);
                }
                month4.setDate(month4.getDate() + k);
                monday = month4;
            }
        }

        for (var i = 0; i < 7; i++) {
            var evs = events.filter(function (ev) {
                var date = ev.Start;
                return date.getMonth() == $scope.month && date.getDate() == monday.getDate();
            });
            var tds = todos.filter(function (td) {
                var date = td.Start;
                return date.getMonth() == $scope.month && date.getDate() == monday.getDate();
            });
            result.push({
                id: i,
                day: monday.getDate(),
                month: monday.getMonth(),
                year: monday.getFullYear(),
                date: new Date(monday),
                events: evs,
                types: korgieApi.getTypes(evs),
                todos: tds
            });
            monday.setDate(monday.getDate() + 1);
        }
        $scope.month = result[3].month;
        $scope.year = result[3].year;
        return result;
    };

    function getProfileInfo() {
        var param, method;
        method = '/Event/GetProfileInfo';
        $http.get(method).then(function successCallback(response) {
            catchProfileInfo(response.data);
        }, function errorCallback(response) {
            console.log('getProfileInfo failed from eventsCtrl');
        });
    };
    function catchProfileInfo(data) {
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
    };
    getProfileInfo();

    function getContacts() {
        var method;
        method = '/Event/GetContacts';
        $http.get(method).then(function successCallback(response) {
            $scope.contacts = response.data;
            console.log($scope.contacts);
        }, function errorCallback(response) {
            console.log('getContacts failed from eventsCtrl');
        });
    };
    getContacts();

    function convertEvents(eventData, todoData) {
        var deferred = $q.defer();
        var eventResult = [], todoResult = [];
        eventData.forEach(function (element) {
            var color;
            switch (element.Type) {
                case "Sports":
                    color = korgieApi.sport;
                    break;
                case "Work":
                    color = korgieApi.work;
                    break;
                case "Study":
                    color = korgieApi.study;
                    break;
                case "Rest":
                    color = korgieApi.rest;
                    break;
                case "Additional":
                    color = korgieApi.additional;
                    break;
            };
            eventResult.push({
                EventId: element.EventId,
                Title: element.Title,
                Start: new Date(new Date(parseInt(element.Start.substr(6)))),
                Type: element.Type,
                Color: color[2],
                Description: element.Description,
                Period: element.Period,
                Tags: element.Tags,
                Contacts: []
            });
        });
        todoData.forEach(function (element) {
            var tasks = [];
            element.Tasks.forEach(function (task, i) {
                tasks.push({ Id: i, State: task.State, Name: task.Name });
            });
            todoResult.push({
                TodoId: element.TodoId,
                Title: element.Title,
                Start: new Date(new Date(parseInt(element.Start.substr(6)))),
                Color: element.Color,
                Description: element.Description,
                Tasks: tasks
            });
        });
        events = eventResult;
        todos = todoResult;

        deferred.resolve();
        return deferred.promise;
    };

    function getEvents(isNextPrevWeek) {
        var param, method;
        if (!$scope.isWeekMode) {
            //метод получения ивентов с использованием функции обращения к серверу
            method = '/Event/GetMonthEvents';
            param = {
                month: parseInt($scope.month) + 1,
                year: $scope.year
            }
            $http.get(method, { params: param }).then(function successCallback(eventResponse) {
                $http.get('/Event/GetMonthTodo', { params: param }).then(function successCallback(todoResponse) {
                    setTimeout(function () {
                        convertEvents(eventResponse.data, todoResponse.data).then(function () {
                            $scope.monthDays = getMonthDays();
                        })
                    }, 300);
                }, function errorCallback(response) {
                    console.log('getting todos failed');
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
            $http.get(method, { params: param }).then(function successCallback(eventResponse) {
                $http.get('/Event/GetWeekTodo', { params: param }).then(function successCallback(todoResponse) {
                    setTimeout(function () {
                        convertEvents(eventResponse.data, todoResponse.data).then(function () {
                            $scope.weekDays = getWeekDays(isNextPrevWeek);
                        })
                    }, 300);
                }, function errorCallback(response) {
                    console.log('getting todos failed');
                });
            }, function errorCallback(response) {
                console.log('getting events failed');
            });
        }
    };
    getEvents();

    $scope.nextMonth = function () {
        if ($scope.month < 11) {
            $scope.month++;
        } else {
            $scope.month = 0;
            $scope.year++;
        }
        getEvents();
    };

    $scope.prevMonth = function () {
        if ($scope.month > 0) {
            $scope.month--;
        } else {
            $scope.month = 11;
            $scope.year--;
        }
        getEvents();
    };

    $scope.changeMonthWeek = function () {
        $scope.week = korgieApi.getWeekNumber($scope.month, $scope.year);
        getEvents();
    };

    $scope.showDay = function (index) {
        if (!$scope.isWeekMode) {
            if ($scope.monthDays[index].month != undefined) {
                $scope.dayToShow = $scope.monthDays[index];
            }
        } else {
            $scope.dayToShow = $scope.weekDays[index];
        }
    };

    $scope.nextWeek = function () {
        var sun = $scope.weekDays[6];
        if ((sun.month == 0 && sun.day < 4) || (sun.month == 11 && sun.day > 28)) {
            $scope.week = 1;
            $scope.year++;
        } else {
            $scope.week++;
        }
        getEvents(1);
    };

    $scope.prevWeek = function () {
        if ($scope.week == 1) {
            $scope.year--;
            $scope.month = 11;
            $scope.week = korgieApi.getWeekNumber($scope.month, $scope.year, true);
        } else {
            $scope.week--;
        }
        getEvents(-1);
    };

    $scope.showHideMenu = function () {
        $('.header').toggleClass('opened-menu');
        $('.content').toggleClass('opened-menu');
        $('.dark-div').toggleClass('opened-menu');
    };

    $scope.closeDayMode = function () {
        $scope.dayToShow = undefined;
    };

    $scope.deleteEvent = function (id) {
        $http({
            url: '/Event/DeleteEvents',
            method: "GET",
            params: {
                id: id
            }
        });
        crudEvent(id);
    };

    $scope.deleteTodo = function (id) {
        $http({
            url: '/Event/DeleteTodo',
            method: "GET",
            params: {
                id: id
            }
        });
        crudTodo(id);
    };

    var crudEvent = function (oldEventId, newEvent) {
        var date, d;
        // Adding
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

        // Deleting
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

    var crudTodo = function (oldTodoId, newTodo) {
        var date, newDay;
        // Editing
        if (oldTodoId != -1) {
            if ($scope.isWeekMode) {
                $scope.weekDays.forEach(function (day) {
                    day.todos.forEach(function (ev, i) {
                        if (ev.TodoId == oldTodoId) {
                            date = ev.Start.getDate();
                            day.todos.splice(i, 1);
                        }
                    })
                });
                newDay = $scope.weekDays.filter(function (day) {
                    return day.day == date;
                })[0];
            } else {
                $scope.dayToShow.todos.forEach(function (ev, i) {
                    if (ev.TodoId == oldTodoId) {
                        date = ev.Start.getDate();
                        $scope.dayToShow.todos.splice(i, 1);
                    }
                });
                newDay = $scope.monthDays.filter(function (day) {
                    return day.day == date && day.month != undefined;
                })[0];
            }
            newDay.todos.forEach(function (ev, i) {
                if (ev.TodoId == oldTodoId) {
                    $scope.dayToShow.todos.splice(i, 1);
                }
            });
        }

        // Deleting
        if (newTodo != undefined) {
            date = newTodo.Start.getDate();
            if ($scope.isWeekMode) {
                var i = 0;
                for (; i < 7 && $scope.weekDays[i].day != newTodo.Start.getDate() ; i++) { }
                newDay = $scope.weekDays[i];
            } else {
                var i = 0, length = $scope.monthDays.length;
                for (; i < length && !($scope.monthDays[i].day == newTodo.Start.getDate() && $scope.monthDays[i].month != undefined) ; i++) { }
                newDay = $scope.monthDays[i];
            }
            newDay.todos.push(newTodo);
        }
    }

    $scope.save = function (type) {
        if (type == 'event') {
            saveEvent();
        } else {
            saveTodo();
        }
        $scope.showHideControlls();
        $scope.eventAdding = false;
        $scope.eventEditing = false;
    };
    function saveEvent() {
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
                //Contacts: $scope.eventToEdit.Contacts
            }
        });
        switch ($scope.eventToEdit.Type) {
            case "Sports":
                $scope.eventToEdit.Color = korgieApi.sport[2];
                break;
            case "Work":
                $scope.eventToEdit.Color = korgieApi.work[2];
                break;
            case "Study":
                $scope.eventToEdit.Color = korgieApi.study[2];
                break;
            case "Rest":
                $scope.eventToEdit.Color = korgieApi.rest[2];
                break;
            case "Additional":
                $scope.eventToEdit.Color = korgieApi.additional[2];
                break;
        };
        crudEvent(!$scope.eventAdding ? $scope.eventToEdit.EventId : -1, $scope.eventToEdit);
        $scope.eventToSave = angular.copy($scope.eventToEdit);
        // STUB!
        $scope.eventContacts = $scope.eventToEdit.Contacts;
    };
    function saveTodo() {
        $scope.todoToEdit.Color = korgieApi.rgb2hex($('.mdi-check').parent().css('background-color'));
        crudTodo(!$scope.eventAdding ? $scope.todoToEdit.TodoId : -1, $scope.todoToEdit);
        $scope.todoToSave = angular.copy($scope.todoToEdit);
        $http({
            url: '/Event/SaveTodo',
            method: "GET",
            params: {
                TodoId: $scope.todoToEdit.TodoId || -1,
                Title: $scope.todoToEdit.Title,
                Start: $scope.todoToEdit.Start,
                Color: $scope.todoToEdit.Color,
                Description: $scope.todoToEdit.Description || '',
                States: $scope.todoToEdit.Tasks.map(function (task) {
                    return task.State;
                }),
                Tasks: $scope.todoToEdit.Tasks.map(function (task) {
                    return task.Name;
                })
            }
        });
    };

    $scope.openDialog = function (dialogName, event) {
        if (event == undefined) {
            $scope.eventAdding = true;
            event = {
                Type: 'Work',
                Start: new Date($scope.dayToShow.year, $scope.dayToShow.month, $scope.dayToShow.day, 0, 0),
                Period: 0,
                Color: '#2196f3',
                Tasks: []
            }
            setTimeout(function () {
                $scope.showHideControlls()
            }, 200);
        } else {
            $scope.eventAdding = false;
            $scope.eventEditing = false;
        }
        $scope.eventToSave = event;
        $scope.todoToSave = event;
        $scope.eventToEdit = event;
        $scope.todoToEdit = event;
        LxDialogService.open(dialogName);
    };

    $scope.closingDialog = function (dialogName) {
        LxDialogService.close(dialogName);
    };
    
    $scope.cancel = function (dialogName) {
        $scope.eventToEdit = angular.copy($scope.eventToSave);
        $scope.todoToEdit = angular.copy($scope.todoToSave);
        $scope.showHideControlls();
        $scope.eventEditing = false;
        if ($scope.eventAdding) {
            $scope.closingDialog(dialogName);
        }
    };

    $scope.edit = function () {
        $scope.eventEditing = !$scope.eventEditing;
        setTimeout(function () {
            $scope.showHideControlls()
        }, 200);
    };

    $scope.chooseTodoColor = function (todoId, colorId) {
        $('.color-buttons').children().empty();
        $('.color-buttons').children().eq(colorId).append('<i class="mdi mdi-check"></i>');
    };

    $scope.addingActivity = false;
    $scope.newTask = {
        Id: -1,
        Name: '',
        State: false
    };

    $scope.createActivity = function () {
        $scope.addingActivity = true;
    };

    $scope.addActivity = function () {
        var maxId = 0;
        var l = $scope.todoToEdit.Tasks.length;
        for (var i = 0; i < l; i++) {
            if ($scope.todoToEdit.Tasks[i].Id > maxId) {
                maxId = $scope.todoToEdit.Tasks[i].Id;
            }
        }
        $scope.newTask.Id = maxId + 1;
        $scope.todoToEdit.Tasks.push($scope.newTask);
        $scope.newTask = {
            Id: -1,
            Name: '',
            State: false
        };
        $scope.addingActivity = false;
    };

    $scope.deleteActivity = function (id) {
        var l = $scope.todoToEdit.Tasks.length;
        for (var i = 0; i < l; i++) {
            if ($scope.todoToEdit.Tasks[i].Id == id) {
                $scope.todoToEdit.Tasks.splice(i, 1);
                break;
            }
        }
    };

    $scope.showHideControlls = function () {
        /*$(".controlls-visible").toggle();
        $(".controlls-unvisible").toggle();
        $scope.eventEditing = !$scope.eventEditing;*/
        $scope.eventToEdit = angular.copy($scope.eventToSave);
        $scope.todoToEdit = angular.copy($scope.todoToSave);

        var typeButtons = $('.type-click');
        $('[etype="' + $scope.eventToEdit.Type + '"').addClass('btn--raised').removeClass('btn--flat');
        typeButtons.click(function () {
            typeButtons.removeClass('btn--raised');
            $(this).removeClass('btn--flat').addClass('btn--raised');
            $scope.eventToEdit.Type = $(this).attr('etype');
            switch ($scope.eventToEdit.Type) {
                case "Sports":
                    $scope.eventToEdit.Color = korgieApi.sport[2];
                    break;
                case "Work":
                    $scope.eventToEdit.Color = korgieApi.work[2];
                    break;
                case "Study":
                    $scope.eventToEdit.Color = korgieApi.study[2];
                    break;
                case "Rest":
                    $scope.eventToEdit.Color = korgieApi.rest[2];
                    break;
                case "Additional":
                    $scope.eventToEdit.Color = korgieApi.additional[2];
                    break;
            };
        });

        var periodButtons = $('.period-click');
        $('[period="' + $scope.eventToEdit.Period + '"').addClass('btn--raised').removeClass('btn--flat');
        periodButtons.click(function () {
            periodButtons.removeClass('btn--raised');
            $(this).removeClass('btn--flat').addClass('btn--raised');
            $scope.eventToEdit.Period = $(this).attr('period');
        });

        var colorButtons = $('.color-buttons').children();
        var cButtonsLength = colorButtons.length;
        for (var i = 0; i < cButtonsLength; i++) {
            if (korgieApi.rgb2hex(colorButtons.eq(i).css('background-color')) == $scope.todoToSave.Color) {
                colorButtons.eq(i).append('<i class="mdi mdi-check"></i>');
            }
        }
    };
});