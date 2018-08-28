angular.module('app')
    .config(routes);

function routes($stateProvider, $urlRouterProvider) {

    // default route
    $urlRouterProvider
        .when('', '/login');

    var states = [
        {
            name: 'login',
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'loginController as vm'
        },
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
        }, {
            name: 'user',
            url: '/user',
            templateUrl: 'app/user/user.html',
            controller: 'UserController'
        },

    ];

    angular.forEach(states, function (state) {
        $stateProvider.state(state);
    });

}