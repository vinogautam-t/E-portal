ePortalApp.controller('registryController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$state', '$stateParams', '$uibModal', 'ApiService', '$uibModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'APIURL',
    function ($scope, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, ApiService, $uibModal, DTOptionsBuilder, DTColumnBuilder, APIURL) {
        var today = new Date();
        $scope.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
        $scope.endDate = today;
        

        $scope.getRecordRoomDetails = function(){            
            var obj = {'startDate': moment($scope.startDate, "YYYY-MM-DD").format("YYYY-MM-DD"), 'endDate': moment($scope.endDate, "YYYY-MM-DD").format("YYYY-MM-DD")}

            ApiService.getuserBasedRecordRoom(obj).then(function(response){
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
        };
        
        $scope.statusDetail = [
            {
                0 : 'New File' ,
                1 : 'Waiting for CSR Approval',
                2 : 'Waiting for DR Approval',
                '-1' : 'Rejected pending in PR Table'
            },
            {
                '-1' : 'Order Approved / Order copy correction in PR Table',
                '-2' : 'Order Approved',
                4: 'Moved to Record Romm',
                1: 'Order Approved / Waiting for CSR Approval',
                2: 'Order Approved / Waiting for CSR Approval'
            }
        ];
        
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
            var win = window.open(APIURL+'?action=view_file&id='+row.id, '_blank');
            win.focus();
        }
        
        $scope.viewOrder = function(row){
            var win = window.open(APIURL+'?action=view_order&id='+row.id, '_blank');
            win.focus();
        }


        function reloadData() {
            var resetPaging = false;
            $scope.dtInstance.reloadData(callback, resetPaging);
        }

    }
]);