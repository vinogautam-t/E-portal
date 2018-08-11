ePortalApp.controller('loginController', ['$scope', '$window', '$http', '$timeout', '$state', '$rootScope', '$stateParams', '$uibModal',
    function ($scope, $window, $http, $timeout, $state, $rootScope, $stateParams, $uibModal) {
        $scope.moduleTitle = 'Welcome Back';
        $scope.loginInfo = {name: '', password: ''};

        $scope.loginKeydown = function(e) {
            if(e.keyCode == '32'){
                $scope.login();
            }
        }

        $scope.login = function(){
            if($scope.loginInfo != undefined && $scope.loginInfo.name != '' && $scope.loginInfo.password != ''){
                $state.go('dashboard');
                // setTimeout(function(){ 
                //     location.reload();
                // }, 800);
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
]);