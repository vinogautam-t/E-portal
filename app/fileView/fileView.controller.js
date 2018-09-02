
ePortalApp.controller('viewFileController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModal', 'APIURL',
    function ($scope, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModal, APIURL) {
        // alert('hi');
        $scope.userInfo = ApiService.getUserInfo();

        $scope.fileId = $stateParams.fileId;
        $scope.showFiles = false;
        $scope.previewData =  [];
        $scope.getInfo = function(){
            ApiService.startLoader();
            ApiService.getFileInfo($scope.fileId).then(function(response){
                ApiService.stopLoader();
                if(response.data != undefined && response.data.status == 'success'){
                    if(response.data.data != undefined && response.data.data.file_details != undefined && response.data.data.file_details.length > 0){
                        if(parseInt(response.data.data.status) > 3 ){
                            $scope.showAction = false;
                        }else{
                            if($scope.userInfo.userrole != 'pr'){
                                $scope.showAction = true;
                            }
                        }
                        response.data.data.file_details.map(function(row){
                            if(row.files != undefined && row.files != null && row.files.length > 0){
                                var arr = row.files.split(",");
                                arr.map(function(rowItem){
                                    // $scope.previewData.push('https://e-portal-api-vinogautam.c9users.io/img/Sample1.png');
                                    $scope.previewData.push({'url' : APIURL+ '/img/' + rowItem, 'index': $scope.previewData.length});
                                });
                                // $scope.previewData = $scope.previewData.concat(arr);
                            }
                        });
                        $scope.showFiles = true;
                    }
                }else{

                }
            }).catch(function(err){
                ApiService.stopLoader();
                console.log(err);
            });
        }
        $scope.getInfo();
        
        $scope.process = function(action){
            var data = {"updated_by": $scope.userInfo.id, "id": $scope.fileId};
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