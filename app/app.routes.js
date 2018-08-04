angular.module('app')
    .config(routes);

function routes($stateProvider, $urlRouterProvider) {

    // default route
    $urlRouterProvider
        .when('', '/');

    var states = [
        {
            name: 'dashboard',
            url: '/dashboard',
            templateUrl: 'app/dashboard/dashboard.html',
            controller: 'dashboardController as vm'
        },
        {
            name: 'section',
            url: '/section',
            templateUrl: 'app/section/section.html',
            controller: 'sectionController as vm'
        }
    ];

    angular.forEach(states, function (state) {
        $stateProvider.state(state);
    });

}