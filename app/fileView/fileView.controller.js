ePortalApp.controller('viewFileController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModal',
    function ($scope, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModal) {
        // alert('hi');
        $scope.userInfo = ApiService.getUserInfo();

        $scope.fileId = $stateParams.fileId;
        
        $scope.process = function(action){
            var data = {"updated_by": $scope.fileId, "id": $scope.userInfo.id};
            ApiService.startLoader();
            ApiService.fileProcess(data, action, $scope.userInfo.userrole).then(function(response){
                ApiService.stopLoader();
                if(response.status == 'success'){
                    toastr.success("Record "+ action + " successfully.");
                    $state.go('dashboard');
                }else{
                    toastr.warning("Record "+ action + " failed.");
                }
            }).catch(function(e){
                ApiService.stopLoader();
                toastr.warning("Record "+ action + " failed.");
            });
        }

    }
]);