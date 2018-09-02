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
            name: 'user',
            url: '/user',
            templateUrl: 'app/user/user.html',
            controller: 'UserController'
        },
        {
            name: 'viewFile',
            url: '/viewFile/:fileId',
            templateUrl: 'app/fileView/fileView.html',
            controller: 'viewFileController'
        },
        {
            name: 'resetPwd',
            url: '/resetPwd/:key',
            templateUrl: 'app/resetPassword/resetPassword.html',
            controller: 'resetPasswordController'
        },
        {
            name: 'registryRoom',
            url: '/registryRoom',
            templateUrl: 'app/registry/registry.html',
            controller: 'registryController'
        }      
    ];

    angular.forEach(states, function (state) {
        $stateProvider.state(state);
    });

}

    
angular.module('app').run(['$state', '$rootScope', 'ApiService', function($state, $rootScope, ApiService) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
        var notAuth = ['login', 'resetPwd'];
        // console.log(notAuth.indexOf(toState.name));
        if(notAuth.indexOf(toState.name) == -1){
            if(!ApiService.isLogin()){
                e.preventDefault();
                $state.go('login');
            }
        }
        if(toState.name == 'login'){
            if(ApiService.isLogin()){
                e.preventDefault();
            }
        }
    });
}]);