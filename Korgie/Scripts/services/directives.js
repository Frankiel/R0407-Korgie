/*korgie
    .directive('dayOfMonth', function ($http) {
        return {
            controller: function () {
            },
            scope: {
                month: '@',
                year: '@',
                monthdays: '='
            },
            link: function (scope, element, attrs) {
                scope.events;
                $http.get('/Event/GetEvents', { params: { month: parseInt(scope.month) + 1, year: scope.year } }).then(function successCallback(response) {
                    convertEvents(response.data);
                }, function errorCallback(response) {
                    console.log('getting events failed');
                });

                function convertEvents(data) {
                    var result = new Array();
                    data.forEach(function (element) {
                        result.push({
                            EventId: element.EventId,
                            Title: element.Title,
                            Start: new Date(new Date(parseInt(element.Start.substr(6)))),
                            End: new Date(new Date(parseInt(element.End.substr(6)))),
                            Type: element.Type,
                            Description: element.Description,
                            Period: element.Period,
                            Tags: element.Tags
                        });
                    });
                    console.log(result);
                    scope.events = result;

                    scope.$watch(function () { return scope.monthdays; }, function () {
                        scope.events.forEach(function (element, i) {
                            var firstWeekDay = (new Date(scope.year, scope.month, 1).getDay() + 6) % 7 - 1;
                            $('.month-day:eq(' + (element.Start.getDate() + firstWeekDay) + ')').append('<div class="event">' + element.Title + '</div>');
                        });
                    });
                }
            },
            restrict: 'E',
            transclude: true,
            templateUrl: '../Scripts/templates/dayOfMonth.html'
        };
    });*/