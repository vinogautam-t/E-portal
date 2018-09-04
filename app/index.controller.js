angular.module('app')
    .controller('indexController', indexController);

indexController.$inject = ['$rootScope', '$scope', '$state', '$location', '$uibModal', '$stateParams', '$window','ApiService']

function indexController($rootScope, $scope, $state, $location, $uibModal, $stateParams, $window,ApiService) {
    var vm = this;
    // $scope.isLogin = false;
    // if($location.$$path == '' || $location.$$path == '/'){
    //     $scope.isLogin = true; 
    //     $scope.moduleTitle = 'Welcome Back';
    //     $scope.loginInfo = {name: '', password: ''};
    // }

   
    $scope.getUserInfo = function(){
        $scope.userInfo = ApiService.getUserInfo();
    }

    $scope.getUserInfo();

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

    $scope.logout = function(){
        localStorage.removeItem('userInfo');
        $state.go('login');
    }

}