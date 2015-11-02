function korgieApi($q) {
    this.convertEvents = function (data) {
        var deferred = $q.defer();
        var result = [];
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
    }
};

angular
    .module('korgie')
    .service('korgieApi', korgieApi);
