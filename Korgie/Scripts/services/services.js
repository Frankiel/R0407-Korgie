function korgieApi($q) {
    this.name;
    this.primaryEmail;
    this.additionalEmail;
    this.phone;
    this.country;
    this.city;
    this.sport;
    this.work;
    this.study;
    this.additional;
    this.rest;

    this.getTypes = function (events) {
        var result = [];
        events.forEach(function (event) {
            if (!result.some(type => type == event.Type)) {
                result.push({
                    name: event.Type,
                    color: event.Color
                });
            }
        });
        return result;
    };

    this.getWeekNumber = function (month, year, isPrev) {
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

        // Set the target to the thursday of this week so the  
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
};

angular
    .module('korgie')
    .service('korgieApi', korgieApi);
