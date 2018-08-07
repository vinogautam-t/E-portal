ePortalApp.controller('sectionController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$stateParams', '$uibModal',
    function ($scope, $window, $http, $timeout, $rootScope, $stateParams, $uibModal) {
        
        $scope.addSection = function(){
            var data = {'title': 'Add Section', 'module': 'addSection'};
            $scope.toggleModal('md', data);
        }

        $scope.toggleModal = function(size, data){
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'sectionModal.html',
                controller: 'sectionModalInstanceCtrl',
                size: size,
                resolve: {
                  info: function () {
                    return data;
                  }
                }
              });
          
              modalInstance.result.then(function (selectedItem) {
                console.log(selectedItem);
              });
        }
    }
]);

ePortalApp.controller('sectionModalInstanceCtrl', function ($scope, $uibModalInstance, info) {
    $scope.info = info;
});