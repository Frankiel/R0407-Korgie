var korgie = angular.module('korgie', ['lumx', 'ui.router']);

korgie.controller('eventsCtrl', function ($scope, $http, $q, korgieApi, LxDialogService) {

    korgieApi.setCurState('events');

    $scope.current = moment.utc();
    var events = [], todos = [];
    $scope.monthDays;
    $scope.dayToShow;

    $scope.isWeekMode = false;
    $scope.weekDays;

    $scope.eventAdding = false;
    $scope.eventEditing = false;
    $scope.eventToEdit;
    $scope.eventToSave;
    $scope.todoToEdit;
    $scope.todoToSave;

    $scope.contacts;
    $scope.myPrimaryEmail;

    function getMonthDays() {
        var result = [];

        // Найти день недели первого числа текущего месяца
        var firstWeekDay = (moment.utc({ year: $scope.current.year(), month: $scope.current.month(), date: 1 }).day() + 6) % 7;

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
        var day = moment.utc({ year: $scope.current.year(), month: $scope.current.month(), day: 1 });
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
        return result;
    };
    function getWeekDays(isNextPrev) {
        var result = [];
        var monday;

        // Переключение с текущего месяца
        if (moment.utc().format('MMMM-YYYY') == $scope.current.format('MMMM-YYYY')) {
            if (isNextPrev == undefined) {
                $scope.current = moment.utc();
            }
            monday = $scope.current.clone().day(1);
        } else
            // Переключение с другого месяца
            if (isNextPrev == undefined) {
                $scope.current = moment.utc({ year: $scope.current.year(), month: $scope.current.month(), date: 4 });
                while ($scope.current.day() != 1) {
                    $scope.current.subtract(1, 'day');
                }
                monday = $scope.current;
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
        return result;
    };

    function getProfileInfo() {
        var method;
        method = '/Event/GetProfileInfo';
        $http.get(method).then(function successCallback(response) {
            catchProfileInfo(response.data);
        }, function errorCallback(response) {
            console.log('getProfileInfo failed from eventsCtrl');
        });
    };
    function catchProfileInfo(data) {
        $scope.myPrimaryEmail = data.PrimaryEmail;
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
                Start: moment.utc(element.Start),
                Type: element.Type,
                Color: color[2],
                Description: element.Description,
                Period: element.Period,
                Tags: element.Tags,
                Contacts: [],
                Owner: element.Owner
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
                Start: moment.utc(element.Start),
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
                month: parseInt($scope.current.month()) + 1,
                year: $scope.current.year()
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
                week: $scope.current.week(),
                year: $scope.current.year()
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
        $scope.current.add(1, 'month');
        /*if ($scope.month < 11) {
            $scope.month++;
        } else {
            $scope.month = 0;
            $scope.year++;
        }*/
        getEvents();
    };

    $scope.prevMonth = function () {
        $scope.current.subtract(1, 'month');
        /*if ($scope.month > 0) {
            $scope.month--;
        } else {
            $scope.month = 11;
            $scope.year--;
        }*/
        getEvents();
    };

    $scope.changeMonthWeek = function () {
        $scope.week = korgieApi.getWeekNumber($scope.current.month(), $scope.current.year());
        getEvents();
    };

    $scope.showDay = function (index) {
        if (!$scope.isWeekMode) {
            if ($scope.monthDays[index].date != undefined) {
                $scope.dayToShow = $scope.monthDays[index];
            }
        } else {
            $scope.dayToShow = $scope.weekDays[index];
        }
    };

    $scope.nextWeek = function () {
        $scope.current.add(1, 'week');
        /*var sun = $scope.weekDays[6];
        if ((sun.month == 0 && sun.day < 4) || (sun.month == 11 && sun.day > 28)) {
            $scope.week = 1;
            $scope.year++;
        } else {
            $scope.week++;
        }*/
        getEvents(1);
    };

    $scope.prevWeek = function () {
        $scope.current.subtract(1, 'week');
        /*if ($scope.week == 1) {
            $scope.year--;
            $scope.month = 11;
            $scope.week = korgieApi.getWeekNumber($scope.month, $scope.year, true);
        } else {
            $scope.week--;
        }*/
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
        // Updating & Deleting
        if (oldEventId != -1) {

            // Для недели прохожу ПО СТОРУ и, найдя событие со старым ид, запоминаю старую дату, удаляю его
            if ($scope.isWeekMode) {
                $scope.weekDays.forEach(function (day) {
                    day.events.forEach(function (ev, i) {
                        if (ev.EventId == oldEventId) {
                            date = ev.Start;
                            day.events.splice(i, 1);
                        }
                    })
                });

                // Получаю день ИЗ СТОРА, куда запишу событие
                d = $scope.weekDays.filter(function (day) {
                    return day.date.format('DD-MM-YYYY') == date.format('DD-MM-YYYY');
                })[0];
            } else {

                // Для месяца прохожу по ОТКРЫТОМУ ДНЮ и, найдя событие со старым ид, запоминаю старую дату, удаляю его
                $scope.dayToShow.events.forEach(function (ev, i) {
                    if (ev.EventId == oldEventId) {
                        date = ev.Start;
                        $scope.dayToShow.events.splice(i, 1);
                    }
                });

                // Получаю день ИЗ СТОРА, куда запишу событие
                d = $scope.monthDays.filter(function (day) {
                    return day.date != undefined && day.date.format('DD-MM-YYYY') == date.format('DD-MM-YYYY');
                })[0];
            }

            // Удаляю старое событие из полученного дня
            d.events.forEach(function (ev, i) {
                if (ev.EventId == oldEventId) {
                    $scope.dayToShow.events.splice(i, 1);
                }
            });

            // Получаю типы для дня
            d.types = korgieApi.getTypes(d.events);
        }

        // Updating & Adding
        if (newEvent != undefined) {

            // Получаю новую дату события
            date = newEvent.Start;

            // Для недели найти день с новой датой
            if ($scope.isWeekMode) {
                var i = 0;
                for (; i < 7 && $scope.weekDays[i].date.format('DD-MM-YYYY') != newEvent.Start.format('DD-MM-YYYY'); i++) { }
                d = $scope.weekDays[i];
            }

            // Для месяца найти день с новой датой
            else {
                var i = 0, length = $scope.monthDays.length;
                for (; i < length && !($scope.monthDays[i].date != undefined && $scope.monthDays[i].date.format('DD-MM-YYYY') == newEvent.Start.format('DD-MM-YYYY')); i++) { }
                d = $scope.monthDays[i];
            }

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
            if ($scope.isWeekMode) {
                $scope.weekDays.forEach(function (day) {
                    day.todos.forEach(function (ev, i) {
                        if (ev.TodoId == oldTodoId) {
                            date = ev.Start;
                            day.todos.splice(i, 1);
                        }
                    })
                });
                newDay = $scope.weekDays.filter(function (day) {
                    return day.date.format('DD-MM-YYYY') == date.format('DD-MM-YYYY');
                })[0];
            } else {
                $scope.dayToShow.todos.forEach(function (ev, i) {
                    if (ev.TodoId == oldTodoId) {
                        date = ev.Start;
                        $scope.dayToShow.todos.splice(i, 1);
                    }
                });
                newDay = $scope.monthDays.filter(function (day) {
                    return day.date != undefined && day.date.format('DD-MM-YYYY') == date.format('DD-MM-YYYY');
                })[0];
            }
            newDay.todos.forEach(function (ev, i) {
                if (ev.TodoId == oldTodoId) {
                    $scope.dayToShow.todos.splice(i, 1);
                }
            });
        }

        // Updating & Adding
        if (newTodo != undefined) {
            date = newTodo.Start;
            if ($scope.isWeekMode) {
                var i = 0;
                for (; i < 7 && $scope.weekDays[i].date.format('DD-MM-YYYY') != newTodo.Start.format('DD-MM-YYYY'); i++) { }
                newDay = $scope.weekDays[i];
            } else {
                var i = 0, length = $scope.monthDays.length;
                for (; i < length && !($scope.monthDays[i].date != undefined && $scope.monthDays[i].date.format('DD-MM-YYYY') == newTodo.Start.format('DD-MM-YYYY')); i++) { }
                newDay = $scope.monthDays[i];
            }
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
        $scope.eventToEdit.Start = moment.utc(startDate.setHours(startDate.getHours() - startDate.getTimezoneOffset() / 60));
        var contacts = [korgieApi.primaryEmail];
        for (var i = 0; i < $scope.eventToEdit.Contacts.length; i++) {
            contacts.push($scope.eventToEdit.Contacts[i].PrimaryEmail);
        }
        $http({
            url: '/Event/SaveEvents',
            method: "GET",
            params: {
                EventId: $scope.eventToEdit.EventId || -1,
                Title: $scope.eventToEdit.Title,
                Start: $scope.eventToEdit.Start.toDate(),
                Type: $scope.eventToEdit.Type,
                Description: $scope.eventToEdit.Description || '',
                Period: $scope.eventToEdit.Period || 0,
                Days: 0,
                Tags: $scope.eventToEdit.Tags || '',
                attached: contacts
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
        $scope.eventToEdit.Owner = $scope.myPrimaryEmail;
        crudEvent(!$scope.eventAdding ? $scope.eventToEdit.EventId : -1, $scope.eventToEdit);
        $scope.eventToSave = angular.copy($scope.eventToEdit);
    };
    function saveTodo() {
        $scope.todoToEdit.Start = moment.utc($scope.todoToEdit.Start);
        $scope.todoToEdit.Color = korgieApi.rgb2hex($('.mdi-check').parent().css('background-color'));
        crudTodo(!$scope.eventAdding ? $scope.todoToEdit.TodoId : -1, $scope.todoToEdit);
        $scope.todoToSave = angular.copy($scope.todoToEdit);
        $http({
            url: '/Event/SaveTodo',
            method: "GET",
            params: {
                TodoId: $scope.todoToEdit.TodoId || -1,
                Title: $scope.todoToEdit.Title,
                Start: $scope.todoToEdit.Start.toDate(),
                Color: $scope.todoToEdit.Color,
                Description: $scope.todoToEdit.Description || '',
                States: $scope.todoToEdit.Tasks.map(function (task) {
                    return task.State;
                }),
                Tasks: $scope.todoToEdit.Tasks.map(function (task) {
                    return task.Name;
                }) || []
            }
        });
    };

    $scope.openDialog = function (dialogName, event) {
        if (event == undefined) {
            $scope.eventAdding = true;
            var startDate = $scope.dayToShow.date.clone().toDate();
            event = {
                Type: 'Work',
                Start: $scope.dayToShow.date.clone(),
                StartJsDate: new Date(startDate.setHours(startDate.getHours() + startDate.getTimezoneOffset() / 60)),
                Period: 0,
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
            var startDate = event.Start.clone().toDate()
            event.StartJsDate = new Date(startDate.setHours(startDate.getHours() + startDate.getTimezoneOffset() / 60));
            if (dialogName == 'event') {
                var method = '/Event/GetEventContacts',
                    param = { id: event.EventId };
                $http.get(method, { params: param }).then(function successCallback(response) {
                    $scope.eventToSave.Contacts = response.data;
                }, function errorCallback(response) {
                    console.log('getProfileInfo failed from eventsCtrl');
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