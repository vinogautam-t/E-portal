ePortalApp.controller('registryController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'APIURL',
    function ($scope, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModal, DTOptionsBuilder, DTColumnBuilder, APIURL) {
       
        $scope.getRecordRoomDetails = function(){
            ApiService.getuserBasedRecordRoom().then(function(response){
                console.log(response);
                if(response.data != undefined && response.data.status == 'success' && response.data.data != undefined){
                    if(Object.keys(response.data.data).length > 0){
                        $scope.noData = false;
                        $scope.recordRoomData = response.data.data;
                        $scope.recordRoomDataKeys = Object.keys($scope.recordRoomData);
                    }else{
                        $scope.noData = true;
                    }
                }
            }).catch(function(err){
                console.log(err);
            });
        }
        $scope.getRecordRoomDetails();

        $scope.loadTable = function(){
            var getUrl = APIURL + '?action=record_room_report';
            $scope.dtInstance = {};
            $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax', {
                // Either you specify the AjaxDataProp here
                // dataSrc: 'data',
                url: getUrl,
                type: 'GET'
            })
            // or here
            .withDataProp('data')
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withPaginationType('full_numbers')
            .withOption('rowCallback', rowCallback);
            $scope.dtColumns = [

            ];
        }

        $scope.viewRow = function(row){
            $state.go('viewFile', { fileId:  row.id});
        }


        function reloadData() {
            var resetPaging = false;
            $scope.dtInstance.reloadData(callback, resetPaging);
        }

    }
]);