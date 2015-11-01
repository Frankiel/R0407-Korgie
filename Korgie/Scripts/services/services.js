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
};

angular
    .module('korgie')
    .service('korgieApi', korgieApi);
