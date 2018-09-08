ePortalApp.controller('dashboardController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$stateParams', '$uibModal', 'ApiService', '$uibModal', '$state','UserService','$filter',
    function ($scope, $window, $http, $timeout, $rootScope, $stateParams, $uibModal, ApiService, $uibModal, $state,UserService,$filter) {
        
        $scope.previewData = [];
        $scope.showCarousel = false;

        $scope.datePopup = {'opened' : false};
        $scope.userInfo = ApiService.getUserInfo();
        $scope.employeeList = [];
        
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
              if(data.state == 'addNote'){
                $timeout(function(){
                    branah.initialize("keyboard", "editor");
                }, 1500);
              }
          
              modalInstance.result.then(function (selectedItem) {
                if(selectedItem.state == 'addNote' || selectedItem.state == 'addRecord'){
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

        $scope.toggleAddRecord = function() {
            var data = {'title': 'Add New Records', 'state': 'addRecord', 'sectionList': $scope.sectionList};
            $scope.toggleModal(data);
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

        $scope.getUserList = function () {
            UserService.getUserList('?action=users').then(function (resp) {
                $scope.employeeList = $filter('filter')(resp.data, { 'status': "1" });
            }, function err() {
                console.log('err')
            });
        }
        $scope.getUserList();
        

    }
]);

ePortalApp.controller('notesModalInstanceCtrl', function ($uibModalInstance, $scope, info, ApiService, $timeout) {
    $scope.info = info;
    $scope.userInfo = ApiService.getUserInfo();
    $scope.notesInfo = {'type': 'New'};
    $scope.addRecordNew = {};
    $scope.ok = function (data) {
        $uibModalInstance.close(data);
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.noteTypeChange = function(){
        if($scope.notesInfo.type == 'New'){
            $timeout(function(){
                branah.initialize("keyboard", "editor");

                $('#editor').keyup(function(){
                    $scope.$apply(function(){
                        $scope.notesInfo.notes = $('#editor').val();
                    });
                });

            }, 500);
        }
    }

    if($scope.info.state == 'uploadOrderCopy' || $scope.info.state == 'addRecord'){
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

    if($scope.info.state == 'addRecord'){
        $scope.info.sectionList.map(function(row){
            if(row.id == $scope.userInfo.section[0]){
                $scope.addRecordNew.section = row.name;
            }
        });
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

    $timeout(function(){
        $('#editor').keyup(function(){
            $scope.$apply(function(){
                $scope.notesInfo.notes = $('#editor').val();
            });
        });
    }, 1000);

    $scope.addRecordUpload = function() {
        if($scope.previewData != undefined && $scope.previewData.length > 0){
            $scope.addRecordNew.files = $scope.previewData;
           //console.log($scope.addRecordNew); 
            ApiService.startLoader();
            ApiService.createFiles($scope.addRecordNew).then(function(response){
                ApiService.stopLoader();
                $scope.previewData = [];
                $scope.addRecordNew = {};
                $scope.showCarousel = false;
                document.getElementById("files").value = "";
                toastr.success("Records successfully inserted.");
                $scope.ok({'state': 'addRecord'});
            });
        }
    }
    

    $scope.addNotes = function() {
        var obj = {'notes': $scope.notesInfo.notes, 'updated_by': $scope.userInfo.id, 'id': $scope.info.rowData.id};
        console.log(obj);
        ApiService.startLoader();
        html2canvas(document.getElementById('tamil_container_id'), {
              onrendered: function(canvas) {
                obj.files = canvas.toDataURL();
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
            })
        .catch(function (error) {
            ApiService.stopLoader();
        });
    }

    $scope.addClippingNotes = function() {
        var obj = {'type': 'Clipping', 'fileNo': $scope.notesInfo.fileNo, 'updated_by': $scope.userInfo.id, 'id': $scope.info.rowData.id};
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