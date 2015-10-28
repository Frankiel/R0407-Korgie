korgie
    .filter('monthName', [function () {
        return function (monthNumber) {
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return monthNames[monthNumber];
        }
    }]);