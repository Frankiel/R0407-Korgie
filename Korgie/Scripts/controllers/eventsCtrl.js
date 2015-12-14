var korgie = angular.module('korgie', ['lumx', 'ui.router']);

korgie.controller('eventsCtrl', function ($scope, $q, korgieApi, LxDialogService) {

    korgieApi.setCurState('events');

    $scope.current = moment();
    var events = [], todos = [];
    $scope.days;
    $scope.dayToShow;

    $scope.isMonthMode = true;
    $scope.weekSwitcher;

    $scope.eventAdding = false;
    $scope.eventEditing = false;
    $scope.eventToEdit;
    $scope.eventToSave;
    $scope.todoToEdit;
    $scope.todoToSave;

    $scope.contacts;
    korgieApi.getContacts().then(function (res) {
        $scope.contacts = res;
    });

    $scope.myPrimaryEmail;
    korgieApi.getProfileInfo().then(function () {
        $scope.myPrimaryEmail = korgieApi.primaryEmail;
        getEvents(0);
    });

    function getMonthDays(isNextPrev) {
        var result = [];

        // Найти день недели первого числа текущего месяца
        var firstWeekDay = (moment({ year: $scope.current.year(), month: $scope.current.month(), date: 1 }).day() + 6) % 7;

        // Найти последний день предыдущего месяца
        var lastDayPrev = $scope.current.clone().subtract(1, 'month').endOf('month').date();

        // Заполнить в обратном порядке от последнего
        for (var j = firstWeekDay; j > 0; j--) {
            result.unshift({
                id: j - 1,
                day: lastDayPrev--,
                events: []
            });
        }

        // Найти последний день текущего месяца
        var lastDay = $scope.current.clone().endOf('month').date();
        var day = moment({ year: $scope.current.year(), month: $scope.current.month(), day: 1 });
        // Заполнить ивенты на месяц
        for (var i = 1; i <= lastDay; i++) {

            // Добавляем в массив лишь те ивенты, которые идут в текущий день
            var evs = events.filter(function (ev) {
                return ev.Start.format('DD-MM-YYYY') == day.format('DD-MM-YYYY');
            });
            var tds = todos.filter(function (td) {
                return td.Start.format('DD-MM-YYYY') == day.format('DD-MM-YYYY');
            });
            result.push({
                id: result.length,
                date: day.clone(),
                events: evs,
                types: korgieApi.getTypes(evs),
                todos: tds
            });
            day = day.add(1, 'day');
        }

        // Заполнить оставшееся до конца недели место началом следующего месяца
        for (var i = firstWeekDay + lastDay; i % 7 != 0; i++) {
            result.push({
                id: result.length,
                day: i - (firstWeekDay + lastDay) + 1,
                events: []
            });
        }
        if (isNextPrev == undefined) $scope.isMonthMode = true;
        return result;
    };
    function getWeekDays(isNextPrev) {
        var result = [];
        var monday;

        // Переключение с текущего месяца
        if (moment().format('MMMM-YYYY') == $scope.current.format('MMMM-YYYY')) {
            if (isNextPrev == undefined) {
                $scope.current = moment();
            }
            monday = $scope.current.clone().day(1);
        } else
            // Переключение с другого месяца
            if (isNextPrev == undefined) {
                $scope.current = moment({ year: $scope.current.year(), month: $scope.current.month(), date: 4 });
                while ($scope.current.day() != 1) {
                    $scope.current.subtract(1, 'day');
                }
                monday = $scope.current.clone();
            } else {
                monday = $scope.current.clone().day(1);
            }

        for (var i = 0; i < 7; i++) {
            var evs = events.filter(function (ev) {
                return ev.Start.format('DD-MM-YYYY') == monday.format('DD-MM-YYYY');
            });
            var tds = todos.filter(function (td) {
                return td.Start.format('DD-MM-YYYY') == monday.format('DD-MM-YYYY');
            });
            result.push({
                id: i,
                date: monday.clone(),
                events: evs,
                types: korgieApi.getTypes(evs),
                todos: tds
            });
            monday = monday.add(1, 'day');
        }
        if (isNextPrev == undefined) $scope.isMonthMode = false;
        return result;
    };
    function getEvents(isNextPrev) {
        if ($scope.weekSwitcher === false) {
            if (moment().format('MMMM-YYYY') != $scope.current.format('MMMM-YYYY')) {
                $scope.current.set('date', 4);
            } else {
                $scope.current.set('date', moment().date());
            }
        }
        korgieApi.getEvents($scope.weekSwitcher, $scope.current.clone()).then(function (result) {
            events = result.events;
            todos = result.todos;
            if (!$scope.weekSwitcher) {
                $scope.days = getMonthDays(isNextPrev);
            } else {
                $scope.days = getWeekDays(isNextPrev);
            }
        });
    };

    $scope.nextMonth = function () {
        $scope.current.add(1, 'month');
        getEvents(1);
    };

    $scope.prevMonth = function () {
        $scope.current.subtract(1, 'month');
        getEvents(-1);
    };

    $scope.changeMonthWeek = function () {
        getEvents();
    };

    $scope.showDay = function (index) {
        if ($scope.days[index].date != undefined) {
            $scope.dayToShow = $scope.days[index];
        }
    };

    $scope.nextWeek = function () {
        $scope.current.add(1, 'week');
        getEvents(1);
    };

    $scope.prevWeek = function () {
        $scope.current.subtract(1, 'week');
        getEvents(-1);
    };

    $scope.showHideMenu = function () {
        korgieApi.showHideMenu();
    };

    $scope.closeDayMode = function () {
        $scope.dayToShow = undefined;
    };

    $scope.deleteEvent = function (id) {
        korgieApi.deleteEvent(id);
        crudEvent(id);
    };

    $scope.deleteTodo = function (id) {
        korgieApi.deleteTodo(id);
        crudTodo(id);
    };

    var crudEvent = function (oldEventId, newEvent) {
        var date, d;
        // Updating & Deleting
        if (oldEventId != -1) {

            // Прохожу по открытому дню, удаляю событие
            if ($scope.dayToShow != undefined) {
                $scope.dayToShow.events.forEach(function (ev, i) {
                    if (ev.EventId == oldEventId) {
                        date = ev.Start;
                        $scope.dayToShow.events.splice(i, 1);
                    }
                });
            } else {
                date = $scope.eventToSave.Start;
            }

            // Получаю день ИЗ СТОРА, откуда удалю событие
            d = $scope.days.filter(function (day) {
                return day.date != undefined && day.date.format('DD-MM-YYYY') == date.format('DD-MM-YYYY');
            })[0];

            // Удаляю старое событие из полученного дня
            d.events.forEach(function (ev, i) {
                if (ev.EventId == oldEventId) {
                    d.events.splice(i, 1);
                }
            });

            // Получаю типы для дня
            d.types = korgieApi.getTypes(d.events);
        }

        // Updating & Adding
        if (newEvent != undefined) {

            // Получаю новую дату события
            date = newEvent.Start;

            // Нахожу день с новой датой
            var i = 0, length = $scope.days.length;
            for (; i < length && !($scope.days[i].date != undefined && $scope.days[i].date.format('DD-MM-YYYY') == newEvent.Start.format('DD-MM-YYYY')); i++) { }
            d = $scope.days[i];
            
            // Добавить в найденный день событие, обновить типы
            if (d != undefined) {
                d.events.push(newEvent);
                d.types = korgieApi.getTypes(d.events);
            }
        }
    };

    var crudTodo = function (oldTodoId, newTodo) {
        var date, newDay;
        // Updating & Deleting
        if (oldTodoId != -1) {
            // Прохожу по открытому дню, удаляю событие
            if ($scope.dayToShow != undefined) {
                $scope.dayToShow.todos.forEach(function (td, i) {
                    if (td.TodoId == oldTodoId) {
                        date = td.Start;
                        $scope.dayToShow.todos.splice(i, 1);
                    }
                });
            } else {
                date = $scope.todoToSave.Start;
            }

            // Получаю день ИЗ СТОРА, куда запишу событие
            newDay = $scope.days.filter(function (day) {
                return day.date != undefined && day.date.format('DD-MM-YYYY') == date.format('DD-MM-YYYY');
            })[0];

            // Удаляю старый туду-лист из полученного дня
            newDay.todos.forEach(function (ev, i) {
                if (ev.TodoId == oldTodoId) {
                    newDay.todos.splice(i, 1);
                }
            });
        }

        // Updating & Adding
        if (newTodo != undefined) {

            date = newTodo.Start;

            var i = 0, length = $scope.days.length;
            for (; i < length && !($scope.days[i].date != undefined && $scope.days[i].date.format('DD-MM-YYYY') == newTodo.Start.format('DD-MM-YYYY')); i++) { }
            newDay = $scope.days[i];

            if (newDay != undefined) {
                newDay.todos.push(newTodo);
            }
        }
    };

    $scope.save = function (type) {
        if (type == 'event') {
            saveEvent();
        } else {
            saveTodo();
        }
        $scope.showHideControlls();
        $scope.eventAdding = false;
        $scope.eventEditing = false;
        $scope.closingDialog(type);
    };
    function saveEvent() {
        var startDate = $scope.eventToEdit.StartJsDate;
        var startTime = $scope.eventToEdit.StartJsTime;
        $scope.eventToEdit.Start = moment.utc([startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes()]).local();
        korgieApi.saveEvent($scope.eventToEdit).then(function (id) {
            $scope.eventToEdit.EventId = id;
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
        $scope.eventToEdit.Owner = $scope.myPrimaryEmail;
        crudEvent(!$scope.eventAdding ? $scope.eventToEdit.EventId : -1, $scope.eventToEdit);
        $scope.eventToSave = angular.copy($scope.eventToEdit);
    };
    function saveTodo() {
        $scope.todoToEdit.Start = moment($scope.todoToEdit.Start);
        $scope.todoToEdit.Color = korgieApi.rgb2hex($('.mdi-check').parent().css('background-color'));
        crudTodo(!$scope.eventAdding ? $scope.todoToEdit.TodoId : -1, $scope.todoToEdit);
        $scope.todoToSave = angular.copy($scope.todoToEdit);
        korgieApi.saveTodo($scope.todoToEdit).then(function (id) {
            $scope.todoToEdit.TodoId = id;
        });
    };

    $scope.openDialog = function (dialogName, event) {
        if (event == undefined) {
            $scope.eventAdding = true;
            var startDate = $scope.dayToShow.date.clone().toDate();
            event = {
                Type: 'Work',
                Start: $scope.dayToShow.date.clone(),
                StartJsDate: startDate,
                StartJsTime: startDate,
                Period: 0,
                Notifications: 0,
                Color: '#2196f3',
                Tasks: [],
                Contacts: []
            };
            setTimeout(function () {
                $scope.showHideControlls()
            }, 200);
        } else {
            $scope.eventAdding = false;
            $scope.eventEditing = false;
            var startDate = event.Start.clone();
            event.StartJsDate = new Date(startDate.year(), startDate.month(), startDate.date());
            event.StartJsTime = new Date(startDate.year(), startDate.month(), startDate.date(), startDate.hours(), startDate.minutes());
            if (event.Notifications == undefined) event.Notifications = 0;
            if (dialogName == 'event') {
                korgieApi.getEventContacts(event.EventId).then(function (contacts) {
                    $scope.eventToSave.Contacts = contacts;
                });
            }
        }
        $scope.eventToSave = event;
        $scope.eventToEdit = event;
        $scope.todoToSave = event;
        $scope.todoToEdit = event;
        LxDialogService.open(dialogName);
    };

    $scope.closingDialog = function (dialogName) {
        LxDialogService.close(dialogName);
    };
    
    $scope.cancel = function (dialogName) {
        $scope.eventToEdit = angular.copy($scope.eventToSave);
        $scope.todoToEdit = angular.copy($scope.todoToSave);
        //$scope.showHideControlls();
        $scope.eventEditing = false;
        $scope.closingDialog(dialogName);
    };

    $scope.edit = function () {
        $scope.addingActivity = false;
        $scope.newTask = {
            Id: -1,
            Name: '',
            State: false
        };
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

    $scope.changeActivityState = function () {
        korgieApi.saveTodo($scope.todoToSave);
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
        $scope.eventToEdit = angular.copy($scope.eventToSave);
        $scope.todoToEdit = angular.copy($scope.todoToSave);

        var typeButtons = $('.type-click');
        $('[etype="' + $scope.eventToEdit.Type + '"').addClass('btn--raised').removeClass('btn--flat').addClass('btn--teal');
        typeButtons.click(function () {
            typeButtons.removeClass('btn--raised');
            $(this).removeClass('btn--flat').addClass('btn--raised btn--teal');
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