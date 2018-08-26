ePortalApp.controller('dashboardController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$stateParams', '$uibModal', 'ApiService',
    function ($scope, $window, $http, $timeout, $rootScope, $stateParams, $uibModal, ApiService) {
        

        $scope.getSection = function(){
            ApiService.startLoader();
            ApiService.getSections().then(function(response){
                ApiService.stopLoader();
                if(response.status == 200){
                    if(response.data.status == 'success'){
                        $scope.sectionList = [];
                        response.data.data.forEach(function(row){
                            if(row.type == 'section'){
                                $scope.sectionList.push(row.name);
                            }
                        });
                    }
                }
            });
        }
        $scope.getSection();

        $scope.previewData = [];
        $scope.showCarousel = false;
        $scope.dateOptions = {
            dateDisabled: 'disabled',
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
          };
        $scope.datePopup = {'opened' : false};
          
        $scope.opendatePicker = function() {
            $scope.datePopup.opened = true;
        };

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
        };

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

    }
]);
