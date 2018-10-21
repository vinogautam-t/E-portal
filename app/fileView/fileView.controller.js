
ePortalApp.controller('viewFileController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModal', 'APIURL',
function ($scope, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModal, APIURL) {
    // alert('hi');
    $scope.userInfo = ApiService.getUserInfo();
    $scope.active = 0;
    $scope.fileId = $stateParams.fileId;
    $scope.showFiles = false;
    $scope.showordercopy = false;
    $scope.orderCopy = {placeholder: 'img/placeholder.png'};
    $scope.previewData =  [];
    var signaturePad;
    $scope.registryInfo = {};
    $scope.isOC = false;
    
    $scope.checksignImage = function(){
        ApiService.check_sign_file($scope.orderCopy.otp).then(function(res){
            if(res.data.status == 'success'){
                ApiService.startLoader();
                window.scrollTo(0,window.outerHeight)
                $scope.orderCopy.sign = '../'+res.data.data;
                ApiService.stopLoader();
                /*var signimg = new Image();
                signimg.src = '../'+res.data.data;
                
                ctx = $scope.orderCopy.canvas.getContext("2d");
                signimg.onload = function(){
                    ctx.drawImage(signimg,($scope.userInfo.userrole != 'pr' ? 200 : 400),$scope.orderCopy.canvas.height-200,250, 200);
                    
                    
                }*/
                
                
            } else {
                $timeout(function(){
                    $scope.checksignImage();
                }, 2000);
            }
        });
    };
    
    
    $scope.initSignaturePad = function(){
        $timeout(function(){
            var background = new Image();
            
            if($scope.isOC){
                $scope.showordercopy = true;
                background.src = '../uploads/'+$scope.registryInfo.order_copy;
            } else {
                background.src = $scope.previewData[$scope.previewData.length-1].url;
            }
            
            background.onload = function(){
                /*$scope.orderCopy.canvas = document.createElement('canvas');
                $scope.orderCopy.canvas.width = background.width;
                $scope.orderCopy.canvas.height = background.height;
                
                if($scope.isOC){
                    $("#canvas_container_oc").html($scope.orderCopy.canvas);
                    
                } else {
                    $("#canvas_container_f").html($scope.orderCopy.canvas);
                }
                
                ctx = $scope.orderCopy.canvas.getContext("2d");
                
                ctx.drawImage(background,0,0,background.width,background.height);*/
                
                $scope.checksignImage();
            }  
            
            $('.draggablee').draggable({ containment: "parent" });
        }, 1000);
    }


    $scope.getInfo = function(){
        ApiService.startLoader();
        ApiService.getFileInfo($scope.fileId).then(function(response){
            ApiService.getotp().then(function(res){
                $scope.orderCopy.otp = res.data.data;
                ApiService.stopLoader();
            });
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
                        if(!!row.files){
                            var arr = row.files.split(",");
                            if(row.is_only_log == 0 && arr.length === 1){
                                $scope.previewData.push({'url' : APIURL+ '/uploads/' + arr[0], 'index': $scope.previewData.length});
                            } else if(arr.length > 1) {
                                angular.forEach(arr, function(rowItem, ind){
                                    if(row.is_only_log == 0 || (row.is_only_log == 1 && arr.length-1 !== ind)){
                                        $scope.previewData.push({'url' : APIURL+ '/uploads/' + rowItem, 'index': $scope.previewData.length});
                                    }
                                });
                            }
                            
                            // $scope.previewData = $scope.previewData.concat(arr);
                        }
                    });
                    $scope.showFiles = true;
                    $scope.isOC = $scope.registryInfo.order_copy && $scope.registryInfo.closed == 0;
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

        modalInstance.result.then(function (res) {
            if(res.state == 'expiry'){
                $state.go('dashboard');
            }
        });
    }
    
    $scope.process = function(action){
        if(action == 'approve' && $scope.registryInfo.file_expiry && $scope.userInfo.userrole == 'dr'){
            html2canvas(document.querySelector("#canvas_container_f")).then(canvas => {
                $scope.expired(canvas.toDataURL());
            });
        } else if($scope.registryInfo.closed == '1' && $scope.userInfo.userrole == 'dr'){
            $scope.toggleModal({'title': 'Set Expiry Period', 'state': 'expiry', 'registryInfo': $scope.registryInfo});
        } else{
            $scope.proceed(action);
        }
       
    }

    $scope.expired = function(fileData){
        //var fileData = signaturePad.toDataURL('image/png');
        var data = {"updated_by": $scope.userInfo.id, "id": $scope.fileId, 'files': fileData, 'last_log_id': $scope.registryInfo.file_details[$scope.registryInfo.file_details.length-1].id};

        ApiService.expired(data).then(function(response){
            if(response.status == 'success'){
                toastr.success("Record deleted successfully.");
                $state.go('dashboard');
            }
        }).catch(function(err){
            toastr.warning("Record failed to delete.");
        }); 
    }

    $scope.proceed = function(action){
        ApiService.startLoader();
        if($scope.isOC){
            html2canvas(document.querySelector("#canvas_container_oc")).then(canvas => {
                $scope.proceed_action(canvas.toDataURL(), action);
            });
        } else {
            html2canvas(document.querySelector("#canvas_container_f")).then(canvas => {
                $scope.proceed_action(canvas.toDataURL(), action);
            });
        }
    }
    
    
    $scope.proceed_action = function(fileData, action){
        if($scope.isOC){
            var data = {isOC: $scope.isOC, oc: $scope.registryInfo.order_copy ,"updated_by": $scope.userInfo.id, "id": $scope.fileId, 'files': fileData, 'last_log_id': $scope.registryInfo.file_details[$scope.registryInfo.file_details.length-1].id};
        } else {
            var data = {"updated_by": $scope.userInfo.id, "id": $scope.fileId, 'files': fileData, 'last_log_id': $scope.registryInfo.file_details[$scope.registryInfo.file_details.length-1].id};
        }
        
        
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
    };

}
]);

ePortalApp.controller('expiryModalInstanceCtrl', ['$scope', 'info', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModalInstance', 'APIURL',
    function ($scope, info, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModalInstance, APIURL) {
        $scope.info = info;
        $scope.expiry = {};
        $scope.userInfo = ApiService.getUserInfo();
        console.log($scope.info.registryInfo);
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
            var dateArr = JSON.stringify($scope.expiry.date).split('T');
            var expiryDate = moment(dateArr[0], "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD") ;
            
            var data = {"updated_by": $scope.userInfo.id, "id": $scope.info.registryInfo.id, "expiry": expiryDate};
           
            ApiService.moveToRecordRoom(data).then(function(response){
                if(response.status == 'success'){
                    $scope.ok({'state': 'expiry'});
                    
                }
            }).catch(function(err){

            });

        }

    }
]);
