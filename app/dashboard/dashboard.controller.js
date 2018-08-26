ePortalApp.controller('dashboardController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$stateParams', '$uibModal', 'ApiService', '$uibModal',
    function ($scope, $window, $http, $timeout, $rootScope, $stateParams, $uibModal, ApiService, $uibModal) {
        
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
                    $scope.getFiles();
                }
              });
        }

        $scope.getFiles = function(){
            ApiService.startLoader();
            return ApiService.getFiles();
        }
        
        if($scope.userInfo.userrole == "attender"){
            $scope.fileUpload = {};
            function previewFile(file, i){
                // var obj = new FormData().append('file',file);
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = readSuccess;                                            
                function readSuccess(evt) {    
                    $scope.previewData.push({'index': i, 'name':file.name, 'src':evt.target.result});                        
                };
                $scope.showCarousel = true;
            }
            setTimeout(function(){
                document.getElementById('files').onchange = function(e) {
                    e.preventDefault();			
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
            }, 3000);
    
            $scope.Upload = function(e){
                $scope.fileUpload.files = $scope.previewData
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