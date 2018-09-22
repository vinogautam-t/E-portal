ePortalApp.controller('resetPasswordController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModal',
    function ($scope, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModal) {
    	
    	$scope.resetForm = {'uname': '', 'newPassword': '', 'confirmPassword': ''}
    	if($stateParams.key != undefined){
    		$scope.resetForm.uname = $stateParams.key;
    	}

    	$scope.reset = function(){
    		ApiService.startLoader();
    		ApiService.reset_password($scope.resetForm).then(function(response){
    			ApiService.stopLoader();
    			if(response.status != undefined && response.status == 'success'){
    				toastr.success("Password reset successfully, login with new password");
    				$state.go('login');
    			}
    		}).catch(function(err){
    			ApiService.stopLoader();
    			console.log(err);
    		});
    	}
    }
]);