ePortalApp.controller('loginController', ['$scope', '$window', '$http', '$timeout', '$state', '$rootScope', '$stateParams', '$uibModal', 'ApiService',
    function ($scope, $window, $http, $timeout, $state, $rootScope, $stateParams, $uibModal, ApiService) {
        $scope.moduleTitle = 'Login Form';
        $scope.loginInfo = {username: '', password: ''};

        $scope.loginKeydown = function(e) {
            if(e.keyCode == '32'){
                $scope.login();
            }
        }

        $scope.login = function(){
            if($scope.loginInfo != undefined && $scope.loginInfo.username != '' && $scope.loginInfo.password != ''){
                ApiService.startLoader();
                ApiService.login($scope.loginInfo).then(function (res) {
                    ApiService.stopLoader();
                    if(res.status == 'success'){
                        toastr.success("Welcome back "+ res.data.firstname + ' '+ res.data.lastname);
                        localStorage.setItem('userInfo', JSON.stringify(res.data));
                        $state.go('dashboard');
                    }else{
                        toastr.warning(res.msg);
                    }
                }).catch(function(e){
                    toastr.warning("Login failed, Please try after sometime.");
                });
               //  $state.go('dashboard');
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
            $scope.moduleTitle = 'Login Form';
        }
    }
]);