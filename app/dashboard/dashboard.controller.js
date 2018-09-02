ePortalApp.controller('dashboardController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$stateParams', '$uibModal', 'ApiService', '$uibModal', '$state',
    function ($scope, $window, $http, $timeout, $rootScope, $stateParams, $uibModal, ApiService, $uibModal, $state) {
        
        $scope.previewData = [];
        $scope.showCarousel = false;

        $scope.datePopup = {'opened' : false};
        $scope.userInfo = ApiService.getUserInfo();
        
        $scope.getSection = function(){
            ApiService.startLoader();
            ApiService.getSections().then(function(response){
                ApiService.stopLoader();
                if(response.status == 200){
                    if(response.data.status == 'success'){
                        $scope.sectionList = [];
                        response.data.data.forEach(function(row){
                            if(row.type == 'section'){
                                $scope.sectionList.push({'id': row.id, 'name': row.name});
                            }
                        });
                    }
                }
            });
        }
        $scope.getSection();

        $scope.toggleModal = function(data){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'notesModalContent.html',
                controller: 'notesModalInstanceCtrl',
                size: 'lg',
                resolve: {
                  info: function () {
                    return data;
                  }
                }
              });
          
              modalInstance.result.then(function (selectedItem) {
                if(selectedItem.state == 'addNote'){
                    $scope.getFiles().then(function(response){
                        ApiService.stopLoader();
                        if(response.data.status == 'success'){
                            $scope.fileList = response.data.data;
                        }
                    }).catch(function(e){
                        ApiService.stopLoader();
                    });
                }else if(selectedItem.state == 'uploadOrderCopy'){
                    $scope.getFiles().then(function(response){
                        ApiService.stopLoader();
                        if(response.data.status == 'success'){
                            $scope.fileList = response.data.data;
                        }
                    }).catch(function(e){
                        ApiService.stopLoader();
                    });
                }
              });
        }

        $scope.getFiles = function(){
            ApiService.startLoader();
            return ApiService.getFiles();
        }

        $scope.viewRow = function(row){
            $state.go('viewFile', { fileId:  row.id});
        }
        
        if($scope.userInfo.userrole == "attender"){
            $scope.fileUpload = {};
            function previewFile(file, i){
                // var obj = new FormData().append('file',file);
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = readSuccess;                                            
                function readSuccess(evt) {   
                    if(!$scope.$$phase) {
                        $scope.$apply(function(){
                            $scope.previewData.push({'index': i, 'name':file.name, 'src':evt.target.result});                        
                        });
                    } else {
                        $scope.previewData.push({'index': i, 'name':file.name, 'src':evt.target.result});
                    }
                };
                $scope.showCarousel = true;
            }
            setTimeout(function(){
                document.getElementById('files').onchange = function(e) {
                    e.preventDefault();		
                    $scope.previewData = [];	
                    var files = "";
                    if(e.type == "change"){
                        files = e.target.files;
                    } else if(e.type === "drop"){
                        files = e.originalEvent.dataTransfer.files;
                    }			
                    for(var i=0;i<files.length;i++){
                        var file = files[i];
                        if(file.type.indexOf("image") !== -1){
                            previewFile(file, i);								
                        } else {
                            alert(file.name + " is not supported");
                        }
                    }
                }
                // var canvas = document.getElementById('signature-pad');
                // function resizeCanvas() {
                //     // When zoomed out to less than 100%, for some very strange reason,
                //     // some browsers report devicePixelRatio as less than 1
                //     // and only part of the canvas is cleared then.
                //     var ratio =  Math.max(window.devicePixelRatio || 1, 1);
                //     canvas.width = canvas.offsetWidth * ratio;
                //     canvas.height = canvas.offsetHeight * ratio;
                //     canvas.getContext("2d").scale(ratio, ratio);
                // }
                
                // window.onresize = resizeCanvas;
                // resizeCanvas();
                
                // var signaturePad = new SignaturePad(canvas, {
                // backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
                // });
                
                // document.getElementById('save-png').addEventListener('click', function () {
                // if (signaturePad.isEmpty()) {
                //     return alert("Please provide a signature first.");
                // }
                
                // var data = signaturePad.toDataURL('image/png');
                // console.log(data);
                // window.open(data);
                // });
                
                // document.getElementById('save-jpeg').addEventListener('click', function () {
                // if (signaturePad.isEmpty()) {
                //     return alert("Please provide a signature first.");
                // }
                
                // var data = signaturePad.toDataURL('image/jpeg');
                // console.log(data);
                // window.open(data);
                // });
                
                // document.getElementById('save-svg').addEventListener('click', function () {
                // if (signaturePad.isEmpty()) {
                //     return alert("Please provide a signature first.");
                // }
                
                // var data = signaturePad.toDataURL('image/svg+xml');
                // console.log(data);
                // console.log(atob(data.split(',')[1]));
                // window.open(data);
                // });
                
                // document.getElementById('clear').addEventListener('click', function () {
                // signaturePad.clear();
                // });
            }, 1000);
    
            $scope.Upload = function(e){
                $scope.fileUpload.files = $scope.previewData;
                ApiService.startLoader();
                ApiService.createFiles($scope.fileUpload).then(function(response){
                    ApiService.stopLoader();
                    $scope.previewData = [];
                    $scope.fileUpload = {};
                    $scope.showCarousel = false;
                    document.getElementById("files").value = "";
                    toastr.success("Records successfully inserted.");
                });
            }

        }else if($scope.userInfo.userrole == "pr"){
            $scope.fileList = {'approved': [], 'new': [], 'pending': []};
            
            $scope.getFiles().then(function(response){
                ApiService.stopLoader();
                if(response.data.status == 'success'){
                    $scope.fileList = response.data.data;
                }
            }).catch(function(e){
                ApiService.stopLoader();
            });

            $scope.addNotes = function(rowData){
                var data = {'title': 'Notes', 'state': 'addNote', 'rowData': rowData};
                $scope.toggleModal(data);
            }

            $scope.uploadOrder = function(rowData){
                var data = {'title': 'Upload Order Copy', 'state': 'uploadOrderCopy', 'rowData': rowData};
                $scope.toggleModal(data);
            }

        }else if($scope.userInfo.userrole == "csr" || $scope.userInfo.userrole == "dr"){
            $scope.getFiles().then(function(response){
                ApiService.stopLoader();
                if(response.data.status == 'success'){
                    $scope.csrFileList = response.data.data;
                    $scope.sections = Object.keys($scope.csrFileList);
                    console.log(Object.keys($scope.csrFileList));
                }
            }).catch(function(e){
                ApiService.stopLoader();
            });
        }
        

    }
]);

ePortalApp.controller('notesModalInstanceCtrl', function ($uibModalInstance, $scope, info, ApiService) {
    $scope.info = info;
    $scope.userInfo = ApiService.getUserInfo();
    $scope.notesInfo = {'type': 'New'};
    $scope.ok = function (data) {
        $uibModalInstance.close(data);
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    if($scope.info.state == 'uploadOrderCopy'){
        $scope.showCarousel = false;
        setTimeout(function(){
            document.getElementById('files').onchange = function(e) {
                e.preventDefault();		
                $scope.previewData = [];	
                var files = "";
                if(e.type == "change"){
                    files = e.target.files;
                } else if(e.type === "drop"){
                    files = e.originalEvent.dataTransfer.files;
                }			
                for(var i=0;i<files.length;i++){
                    var file = files[i];
                    if(file.type.indexOf("image") !== -1){
                        previewFile(file, i);								
                    } else {
                        alert(file.name + " is not supported");
                    }
                }
            }
        },1000);
    }
    
    $scope.uploadOrder = function(){
        var data = {'id': $scope.info.rowData.id, 'updated_by': $scope.userInfo.id, 'files': $scope.previewData};
        ApiService.startLoader();
        ApiService.uploadOrderCopy(data).then(function(response){
            ApiService.stopLoader();
            if(response != undefined && response.status == 'success'){
                $scope.ok({'state': 'uploadOrderCopy'});
            }else{
                toastr.warning('Something went wrong.');
            }
        }).catch(function(err){
            ApiService.stopLoader();
        });
    }

    function previewFile(file, i){
        // var obj = new FormData().append('file',file);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = readSuccess;                                            
        function readSuccess(evt) {   
            if(!$scope.$$phase) {
                $scope.$apply(function(){
                    $scope.previewData.push({'index': i, 'name':file.name, 'src':evt.target.result});                        
                });
            } else {
                $scope.previewData.push({'index': i, 'name':file.name, 'src':evt.target.result});
            }
        };
        $scope.showCarousel = true;
    }

    $scope.addNotes = function() {
        var obj = {'notes': $scope.notesInfo.notes, 'updated_by': $scope.userInfo.id, 'id': $scope.info.rowData.id};
        console.log(obj);
        ApiService.startLoader();
        ApiService.addNotes(obj).then(function(response){
            ApiService.stopLoader();
            if(response.status == 'success'){
                toastr.success("successfully added notes");
                $scope.ok({'state': 'addNote'});
            }
        }).catch(function(e){
            ApiService.stopLoader();
        });
    }

});