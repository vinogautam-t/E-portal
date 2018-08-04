angular.module('app')
    .controller('indexController', indexController);

indexController.$inject = ['$rootScope', '$scope', '$state', '$location', '$uibModal', '$stateParams', '$window']

function indexController($rootScope, $scope, $state, $location, $uibModal, $stateParams, $window) {
    var vm = this;
    $scope.isLogin = false;
    if($location.$$path == '' || $location.$$path == '/'){
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
            $state.go('section');
            setTimeout(function(){ 
                location.reload();
            }, 800);
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

    $scope.openNav = function(){
        document.getElementById("side-nav").style.left = '0px';
        document.getElementById("menu-btn").style.display = 'none';
        document.getElementById('isNavOpen').value = 'true';
    }

    $scope.closeNav = function(){
        document.getElementById("side-nav").style.left = '-260px';
        document.getElementById("menu-btn").style.display = 'block';
        document.getElementById('isNavOpen').value = 'false';
    }

}

function screenResize(){
    //var width = document.getElementById("body").outerWidth;
    if(window.innerWidth < 768 ){
         console.log(document.getElementById('isNavOpen').value);
        if(document.getElementById('isNavOpen').value == 'false'){
            document.getElementById("menu-btn").style.display = 'block';
         }else{
            document.getElementById("menu-btn").style.display = 'none';
         }
    }else{
        document.getElementById("menu-btn").style.display = 'none';
    }
}