korgie
    .filter('monthName', function () {
        return function (monthNumber) {
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return monthNames[monthNumber];
        }
    })
    .filter('dayMode', function ($filter) {
        return function (date) {
            return $filter('monthName')(date.month) + ' ' + date.day + ', ' + date.year;
        }
    })
    .filter('getStartTime', function () {
        return function (date) {
            var mins = date.getMinutes();
            return date.getHours() + ':' + ((mins < 10) ? '0' + mins : mins);
        }
    })
    .filter('numToPeriod', function () {
        return function (numPeriod) {
            switch (numPeriod) {
                case 1: return 'Day';
                case 7: return 'Week';
                case 30: return 'Month';
                case 365: return 'Year';
                default: return 'None';
            }
        }
    });