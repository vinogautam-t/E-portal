angular.module('app')
    .controller('indexController', indexController);

indexController.$inject = ['$rootScope', '$scope', '$state', '$location', '$uibModal', '$stateParams', '$window']

function indexController($rootScope, $scope, $state, $location, $uibModal, $stateParams, $window) {
    var vm = this;
    $scope.isLogin = false;
    if($state.current.name == ''){
        $scope.isLogin = true; 
        $scope.moduleTitle = 'Welcome Back';
        $scope.loginInfo = {name: '', password: ''};
    }
    
    $scope.loginKeydown = function(e) {
        if(e.keyCode == '32'){
            $scope.login();
        }
    }

    $scope.login = function(){
        if($scope.loginInfo != undefined && $scope.loginInfo.name != '' && $scope.loginInfo.password != ''){

        }
    }

    $scope.toggleRegister = function(){
        $scope.moduleTitle = 'Register New User';
    }

    $scope.toggleForgotPwd = function(){
        $scope.moduleTitle = "Forgot Password";
    }

    $scope.toggleLogin = function(){
        $scope.moduleTitle = 'Welcome Back';
    }

}
