korgie.controller('mycontactsCtrl', function ($scope, $http, korgieApi) {
    console.log("Initializing mycontactsCtrl");

    $scope.contacts = [
        { name: "Adam Withouteva", primaryEmail: "adamwithouteva@email.com", phone: "25525361783", country: "Australia", city: "Sydney" },
        { name: "Carl Ohmygod", primaryEmail: "pleasecarl@email.com", phone: "09347813414", country: "Ukraine", city: "Kiev" },
        { name: "Anna Kuzochkina", primaryEmail: "annakarenina@email.com", phone: "52935415619", country: "Germany", city: "Frankfurt am Main" },
        { name: "Robert de Niro", primaryEmail: "robertdeniro@email.com", phone: "53049135315183", country: "China", city: "Beijing" },
        { name: "Frank Martin", primaryEmail: "frankmartin@email.com", phone: "15478391349", country: "USA", city: "Los-Angeles" },
        { name: "Maria Eliseeva", primaryEmail: "mariaeliseeva@email.com", phone: "109888563134", country: "Great Britain", city: "London" },
        { name: "Erlich Bachman", primaryEmail: "urdirtymzfkers@email.com", phone: "151375781399", country: "Poland", city: "Lublin" },
        { name: "Arthur Anti-Dalai-Lama", primaryEmail: "antidalailama@email.com", phone: "1409535739", country: "France", city: "Paris" },
        { name: "Adam Withouteva", primaryEmail: "adamwithouteva@email.com", phone: "25525361783", country: "Australia", city: "Sydney" },
        { name: "Carl Ohmygod", primaryEmail: "pleasecarl@email.com", phone: "09347813414", country: "Ukraine", city: "Kiev" },
        { name: "Anna Kuzochkina", primaryEmail: "annakarenina@email.com", phone: "52935415619", country: "Germany", city: "Frankfurt am Main" },
        { name: "Robert de Niro", primaryEmail: "robertdeniro@email.com", phone: "53049135315183", country: "China", city: "Beijing" },
        { name: "Frank Martin", primaryEmail: "frankmartin@email.com", phone: "15478391349", country: "USA", city: "Los-Angeles" },
        { name: "Maria Eliseeva", primaryEmail: "mariaeliseeva@email.com", phone: "109888563134", country: "Great Britain", city: "London" },
        { name: "Erlich Bachman", primaryEmail: "urdirtymzfkers@email.com", phone: "151375781399", country: "Poland", city: "Lublin" },
        { name: "Arthur Anti-Dalai-Lama", primaryEmail: "antidalailama@email.com", phone: "1409535739", country: "France", city: "Paris" },
    ]
});