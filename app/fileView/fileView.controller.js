
ePortalApp.controller('viewFileController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModal', 'APIURL',
function ($scope, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModal, APIURL) {
    // alert('hi');
    $scope.userInfo = ApiService.getUserInfo();
    $scope.active = 0;
    $scope.fileId = $stateParams.fileId;
    $scope.showFiles = false;
    $scope.previewData =  [];
    var signaturePad;
    $scope.registryInfo = {};
    $scope.initSignaturePad = function(){
        $timeout(function(){
            var canvas = document.getElementById('canvas_container');
            var background = new Image();
            background.src = $scope.previewData[$scope.previewData.length-1].url;
            // background.src = 'img/pdf.png';
            ctx = canvas.getContext("2d");
            // Make sure the image is loaded first otherwise nothing will draw.
            background.onload = function(){
                ctx.drawImage(background,0,0);   
            }  
            signaturePad = new SignaturePad(canvas, {
                penColor: 'green',
                backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
            });
                
        }, 1000);
    }


    $scope.getInfo = function(){
        ApiService.startLoader();
        ApiService.getFileInfo($scope.fileId).then(function(response){
            ApiService.stopLoader();
            if(response.data != undefined && response.data.status == 'success'){
                
                if(response.data.data != undefined && response.data.data.file_details != undefined && response.data.data.file_details.length > 0){
                    $scope.registryInfo = response.data.data;
                    if(parseInt(response.data.data.status) > 3 ){
                        $scope.showAction = false;
                    }else{
                        if($scope.userInfo.userrole != 'pr'){
                            $scope.showAction = true;
                        }
                    }
                    response.data.data.file_details.map(function(row){
                        if(!!row.files && row.is_only_log == 0){
                            var arr = row.files.split(",");
                            arr.map(function(rowItem){
                                // $scope.previewData.push('https://e-portal-api-vinogautam.c9users.io/img/Sample1.png');
                                $scope.previewData.push({'url' : APIURL+ '/uploads/' + rowItem, 'index': $scope.previewData.length});
                            });
                            // $scope.previewData = $scope.previewData.concat(arr);
                        }
                    });
                    $scope.showFiles = true;
                    $scope.initSignaturePad();
                }
            }else{

            }
        }).catch(function(err){
            ApiService.stopLoader();
            console.log(err);
        });
    }
    $scope.getInfo();

    $scope.toggleModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'expiryModalContent.html',
            controller: 'expiryModalInstanceCtrl',
            size: 'lg',
            resolve: {
              info: function () {
                return data;
              }
            }
        });

        modalInstance.result.then(function (selectedItem) {

        });
    }
    
    $scope.process = function(action){
        if($scope.registryInfo.approved = '1' && $scope.userInfo.userrole == 'dr'){
            $scope.toggleModal({'title': 'Set Expiry Period', 'state': 'expiry'});
        }else{
            $scope.proceed();
        }
       
    }

    $scope.proceed = function(){
        var fileData = signaturePad.toDataURL('image/png');
        if(fileData!=undefined){
            var data = {"updated_by": $scope.userInfo.id, "id": $scope.fileId, 'files': fileData, 'last_log_id': $scope.registryInfo.file_details[$scope.registryInfo.file_details.length-1].id};
        }else{
            var data = {"updated_by": $scope.userInfo.id, "id": $scope.fileId};
        }
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

ePortalApp.controller('expiryModalInstanceCtrl', ['$scope', 'info', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModal', 'APIURL',
    function ($scope, info, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModal, APIURL) {
        $scope.info = info;
        $scope.expiry = {};

        $timeout(function(){
            // var today = new Date();
            // var dd = today.getDate();
            // var mm = today.getMonth()+1; //January is 0!
            // var yyyy = today.getFullYear();
            // if(dd<10){
            //         dd='0'+dd
            //     } 
            //     if(mm<10){
            //         mm='0'+mm
            //     } 

            // today = yyyy+'-'+mm+'-'+dd;
            // document.getElementById("expiryDate").setAttribute("min", today);
        }, 1000);

        $scope.ok = function(data) {
            $uibModalInstance.close(data);
        };
        
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.setExpiry = function(){
            console.log($scope.expiry);
        }

    }
]);
