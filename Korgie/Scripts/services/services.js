function korgieApi($q) {
    this.convertEvents = function (data) {
        var deferred = $q.defer();
        var result = [];
        data.forEach(function (element) {
            result.push({
                EventId: element.EventId,
                Title: element.Title,
                Start: new Date(new Date(parseInt(element.Start.substr(6)))),
                Type: element.Type,
                Description: element.Description,
                Period: element.Period,
                Tags: element.Tags
            });
        });
        deferred.resolve(result);
        return deferred.promise;
    };

    this.getTypes = function (events) {
        var result = [];
        events.forEach(function (event) {
            if (!result.some(type => type == event.Type)) {
                result.push(event.Type);
            }
        });
        return result;
    };

    this.getWeekNumber = function (month, year) {
        var target = new Date(year, month, 1);
        var d = new Date(year, month, 1);

        // ISO week date weeks start on monday  
        // so correct the day number  
        var dayNr = (d.getDay() + 6) % 7;

        // Set the target to the thursday of this week so the  
        // target date is in the right year  
        target.setDate(target.getDate() - dayNr);

        // ISO 8601 states that week 1 is the week  
        // with january 4th in it  
        var jan4 = new Date(target.getFullYear(), 0, 4);

        // Number of days between target date and january 4th  
        var dayDiff = (target - jan4) / 86400000;

        // Calculate week number: Week 1 (january 4th) plus the    
        // number of weeks between target date and january 4th    
        var weekNr = 1 + Math.ceil(dayDiff / 7);

        return weekNr;
    };
};

angular
    .module('korgie')
    .service('korgieApi', korgieApi);
