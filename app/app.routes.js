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
        },{
            name: 'listUser',
            url: '/listuser',
            templateUrl: 'app/user/list_user.html',
            controller: 'UserController'
        },
        {
            name: 'addUser',
            url: '/user/add',
            templateUrl: 'app/user/create_user.html',
            controller: 'AddUserController'
        },
        {
            name: 'editUser',
            url: '/user/edit:id',
            templateUrl: 'app/user/create_user.html',
            controller: 'AddUserController'
        },
        {
            name: 'viewFile',
            url: '/viewFile/:fileId',
            templateUrl: 'app/fileView/fileView.html',
            controller: 'viewFileController'
        }
    ];

    angular.forEach(states, function (state) {
        $stateProvider.state(state);
    });

}