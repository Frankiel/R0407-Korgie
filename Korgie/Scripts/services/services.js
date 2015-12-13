korgie
    .factory('korgieApi', function ($q, $http) {
        var korgieApi = {};

        korgieApi.types;
        korgieApi.currentstate = [{ state: 'events', isActive: false },
                            { state: 'settings', isActive: false },
                            { state: 'contacts.mycontacts', isActive: false },
                            { state: 'contacts.addcontact', isActive: false },
                            { state: 'contacts.sent', isActive: false },
                            { state: 'contacts.recieved', isActive: false },
                            { state: 'notifications', isActive: false }, ];
        korgieApi.contacts = [];

        korgieApi.requestsSent;

        korgieApi.getTypes = function (events) {
            var result = [];
            events.forEach(function (event) {
                if (!result.some(type => type.name == event.Type)) {
                    result.push({
                        name: event.Type,
                        color: event.Color
                    });
                }
            });
            return result;
        };

        korgieApi.getWeekNumber = function (month, year, isPrev) {
            var today = new Date(), day = 1;
            if (month == today.getMonth()) {
                day = today.getDate();
            }
            if (isPrev != undefined) {
                day = 31;
            }
            var target = new Date(year, month, day);
            var d = new Date(year, month, day);

            // ISO week date weeks start on monday  
            // so correct the day number  
            var dayNr = (d.getDay() + 6) % 7;

            // Set the target to the thursday of korgieApi week so the  
            // target date is in the right year  
            target.setDate(target.getDate() - dayNr + 3);

            // ISO 8601 states that week 1 is the week  
            // with january 4th in it  
            var jan4 = new Date(year, 0, 4);

            // Number of days between target date and january 4th  
            var dayDiff = (target - jan4) / 86400000;

            // Calculate week number: Week 1 (january 4th) plus the    
            // number of weeks between target date and january 4th    
            var weekNr = 1 + Math.ceil(dayDiff / 7);

            return weekNr;
        };

        korgieApi.rgb2hex = function (rgb) {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*(\d+))?\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        };

        korgieApi.getCurState = function () {
            for (var i = 0; i < korgieApi.currentstate.length; i++) {
                if (korgieApi.currentstate[i].isActive == true) {
                    return korgieApi.currentstate[i].state;
                }
            }
        };

        korgieApi.setCurState = function (param) {
            for (var i = 0; i < korgieApi.currentstate.length; i++) {
                if (korgieApi.currentstate[i].state == param) {
                    return korgieApi.currentstate[i].isActive = true;
                }
                else {
                    korgieApi.currentstate[i].isActive = false;
                }
            }
        };

        korgieApi.showHideMenu = function () {
            $('.header').toggleClass('opened-menu');
            $('.content').toggleClass('opened-menu');
            $('.dark-div').toggleClass('opened-menu');
        };

        korgieApi.getContacts = function () {
            var deferred = $q.defer();
            $http.get('/Event/GetContacts').then(function successCallback(response) {
                korgieApi.contacts = response.data;
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };

        korgieApi.getProfileInfo = function () {
            var deferred = $q.defer();
            $http.get('/Event/GetProfileInfo').then(function successCallback(response) {
                var data = response.data;
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
                deferred.resolve();
            }, function errorCallback(response) {
                deferred.reject();
            });
            return deferred.promise;
        };

        korgieApi.getEvents = function (isWeekMode, current) {
            var deferred = $q.defer();
            var param, method;
            if (!isWeekMode) {
                method = '/Event/GetMonth';
                param = {
                    month: parseInt(current.month()) + 1,
                    year: current.year()
                }
            } else {
                method = '/Event/GetWeek',
                param = {
                    week: current.week(),
                    year: current.year()
                }
            }

            $http.get(method + 'Events', { params: param }).then(function successCallback(eventResponse) {
                $http.get(method + 'Todo', { params: param }).then(function successCallback(todoResponse) {
                    var eventData = eventResponse.data, todoData = todoResponse.data;
                    var eventLength = eventData.length, todoLength = todoData.length;
                    var eventResult = [], todoResult = [];
                    for (var i = 0; i < eventLength; i++) {
                        var color;
                        switch (eventData[i].Type) {
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
                            EventId: eventData[i].EventId,
                            Title: eventData[i].Title,
                            Start: moment.utc(eventData[i].Start).local(),
                            Type: eventData[i].Type,
                            Color: color[2],
                            Description: eventData[i].Description,
                            Notifications: eventData[i].Notify,
                            Period: eventData[i].Period,
                            Tags: eventData[i].Tags,
                            Contacts: [],
                            Owner: eventData[i].Owner
                        });
                    }

                    for (var i = 0; i < todoLength; i++) {
                        var tasks = [];
                        for (var j = 0; j < todoData[i].Tasks.length; j++) {
                            tasks.push({
                                Id: i,
                                State: todoData[i].Tasks[j].State,
                                Name: todoData[i].Tasks[j].Name
                            });
                        }
                        todoResult.push({
                            TodoId: todoData[i].TodoId,
                            Title: todoData[i].Title,
                            Start: moment.utc(todoData[i].Start),
                            Color: todoData[i].Color,
                            Description: todoData[i].Description,
                            Tasks: tasks
                        });
                    }
                    deferred.resolve({ events: eventResult, todos: todoResult });
                });
            });
            return deferred.promise;
        };

        korgieApi.deleteEvent = function (id) {
            $http({
                url: '/Event/DeleteEvents',
                method: "GET",
                params: {
                    id: id
                }
            });
        };

        korgieApi.deleteTodo = function (id) {
            $http({
                url: '/Event/DeleteTodo',
                method: "GET",
                params: {
                    id: id
                }
            });
        };

        korgieApi.saveEvent = function (event) {
            var deferred = $q.defer();
            var contacts = [korgieApi.primaryEmail];
            for (var i = 0; i < event.Contacts.length; i++) {
                contacts.push(event.Contacts[i].PrimaryEmail);
            }
            var start = event.Start.utc();
            $http({
                url: '/Event/SaveEvents',
                method: "GET",
                params: {
                    EventId: event.EventId || -1,
                    Title: event.Title,
                    Start: new Date(start.year(), start.month(), start.date(), start.hours(), start.minutes()),
                    Type: event.Type,
                    Description: event.Description || '',
                    Period: event.Period || 0,
                    Days: 0,
                    Tags: event.Tags || '',
                    attached: contacts,
                    Notify: event.Notifications || 0
                }
            }).then(function (response) {
                if (event.EventId == undefined) {
                    event.EventId = response.data;
                }
                deferred.resolve(event.EventId);
            });
            return deferred.promise;
        };

        korgieApi.saveTodo = function (todo) {
            var deferred = $q.defer();
            var start = todo.Start.clone().add(todo.Start.utcOffset() / 60, 'h');
            $http({
                url: '/Event/SaveTodo',
                method: "GET",
                params: {
                    TodoId: todo.TodoId || -1,
                    Title: todo.Title,
                    Start: /*todo.Start.local().toDate(), //*/new Date(start.year(), start.month(), start.date(), start.hours(), start.minutes()),
                    Color: todo.Color,
                    Description: todo.Description || '',
                    States: todo.Tasks.map(function (task) {
                        return task.State;
                    }),
                    Tasks: todo.Tasks.map(function (task) {
                        return task.Name;
                    }) || []
                }
            }).then(function (response) {
                if (todo.TodoId == undefined) {
                    todo.TodoId = response.data;
                }
                deferred.resolve(todo.TodoId);
            });
            return deferred.promise;
        };

        korgieApi.getEventContacts = function (eventId) {
            var deferred = $q.defer();
            var method = '/Event/GetEventContacts',
                    param = { id: eventId };
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };

        //SETTINGS

        korgieApi.saveProfileInfo = function (name, primaryEmail, additionalEmail, phone, country, city, types) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/SaveProfileInfo';
            param = {
                Name: name,
                PrimaryEmail: primaryEmail,
                AdditionalEmail: additionalEmail,
                Phone: phone,
                Country: country,
                City: city,
                Sport: types[2],
                Work: types[0],
                Rest: types[3],
                Study: types[1],
                Additional: types[4]
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve();
            }, function errorCallback(response) {
                deferred.reject();
            });
            return deferred.promise;
        };

        korgieApi.addContact = function (contactEmail) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/AddContact';
            param = {
                email: contactEmail,
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve('ok');
            });
            return deferred.promise;
        };

        korgieApi.getContacts = function () {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/GetContacts';
            $http.get(method).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject();
            });
            return deferred.promise;
        };

        korgieApi.getRequests = function () {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/GetRequest';
            $http.get(method).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject();
            });
            return deferred.promise;
        };

        korgieApi.getRequestsRecieved = function () {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/GetMyRequests';
            $http.get(method).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject();
            });
            return deferred.promise;
        };

        korgieApi.isInvited = function (contactEmail) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/IsInvited';
            param = {
                email: contactEmail,
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(false);
            });
            return deferred.promise;
        };

        korgieApi.isUser = function (contactEmail) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/IsUser';
            param = {
                email: contactEmail,
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject(false);
            });
            return deferred.promise;
        };

        korgieApi.inviteContact = function (contactEmail) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/InviteContact';
            param = {
                email: contactEmail,
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve('ok');
            });
            return deferred.promise;
        };

        //Contacts

        korgieApi.deleteContact = function (contactEmail) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/DeleteContact';
            param = {
                email: contactEmail,
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve('ok');
            });
            return deferred.promise;
        };

        korgieApi.acceptContact = function (email) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/AcceptRequest';
            param = {
                emailcontact: email,
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve('ok');
            });
            return deferred.promise;
        };

        korgieApi.rejectContact = function (email) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/RejectRequest';
            param = {
                emailcontact: email,
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve('ok');
            });
            return deferred.promise;
        };

        //Notifications

        korgieApi.getNotifications = function () {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/GetNotifications';
            $http.get(method).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function errorCallback(response) {
                deferred.reject();
            });
            return deferred.promise;
        };

        korgieApi.checkNotify = function (numb) {
            var deferred = $q.defer();
            var param, method;
            method = '/Event/CheckNotify';
            param = {
                id: numb,
            }
            $http.get(method, { params: param }).then(function successCallback(response) {
                deferred.resolve('ok');
            });
            return deferred.promise;
        };

        return korgieApi;
    });
