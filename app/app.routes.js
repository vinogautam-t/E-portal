angular.module('app')
    .config(routes);

function routes($stateProvider, $urlRouterProvider) {

    // default route
    $urlRouterProvider
        .when('', '/');

    var states = [
        {
            name: 'login',
            url: '/',
            templateUrl: 'app/login/login.html',
            controller: 'loginController as vm'
        }
    ];

    angular.forEach(states, function (state) {
        $stateProvider.state(state);
    });

}