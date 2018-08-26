ePortalApp.controller('sectionController', ['$scope', '$window', '$http', '$timeout', '$rootScope', '$stateParams', '$uibModal', 'SectionService',
    function ($scope, $window, $http, $timeout, $rootScope, $stateParams, $uibModal, SectionService) {
        $scope.sectionList = [];

        $scope.getSectionList = function () {
            SectionService.getSectionList('?action=sections').then(function (resp) {
                $scope.sectionList = resp.data;
            }, function err() {
                console.log('err')
            });
        }
        $scope.getSectionList();

        $scope.addSection = function () {
            var data = { 'title': 'Add Section', 'module': 'addSection' };
            $scope.toggleModal('md', data);
        }

        $scope.editSection = function (sectionData) {
            var data = { 'title': 'Edit Section', 'module': 'editsection', 'sectionObj': sectionData };
            $scope.toggleModal('md', data);
        }

        $scope.toggleModal = function (size, data) {
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

        $scope.deleteSection = function (sectionId, index) {
            var req =
                {
                    "handle": "delete",
                    "id": Number(sectionId)
                };
                SectionService.deleteSectionDetail('?action=section_action', req).then(function (resp) {
                if (resp.status === 'success') {
                    toastr.success("Section Deleted Successfully");
                    $scope.sectionList.splice(index, 1);
                } else {
                    toastr.warning("Section deleting failed, Please try after sometime.");
                }
            }, function err() {
                console.log('err')
                toastr.warning("Service failed, Please try after sometime.");
            });
        }

    }
]);

ePortalApp.controller('sectionModalInstanceCtrl', function ($scope, $uibModalInstance, info, SectionService) {
    $scope.info = info;
    $scope.name;
    $scope.type;
    $scope.action = "add";
    $scope.saveBtnAction = "Create";
    $scope.successMsg = "Section created Successfully";
    $scope.errorMsg = "Section creating failed";
    $scope.sectionId;

    $scope.save = function () {
        var req =
            {
                "handle": $scope.action,
                "name": $scope.name,
                "type": $scope.type
            };

        if ($scope.sectionId) {
            req['id'] = $scope.sectionId;
        }

        SectionService.addSectionDetail('?action=section_action', req).then(function (resp) {
            if (resp.status === 'success') {
                toastr.success($scope.successMsg);
                $uibModalInstance.close();
            } else {
                toastr.warning($scope.errorMsg + ", Please try after sometime.");
            }
        }, function err() {
            toastr.warning("Service failed, Please try after sometime.");
        });
    }

    $scope.findActionType = function () {
        if ($scope.info.sectionObj) {
            $scope.action = 'edit';
            $scope.saveBtnAction = "Update";
            $scope.successMsg = "Section updated Successfully";
            $scope.errorMsg = "Section updating failed";
            $scope.name = $scope.info.sectionObj.name;
            $scope.type = $scope.info.sectionObj.type;
            $scope.sectionId = $scope.info.sectionObj.id;
        }

    };

    $scope.findActionType();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


ePortalApp.factory('SectionService', function (httpService, APIURL) {

    return {
        getSectionList: function (endpoint) {
            return httpService.get(APIURL + endpoint).then(function (result) {
                return (result.data) ? result.data : [];
            });
        },
        addSectionDetail: function (endpoint, body) {
            return httpService.post(APIURL + endpoint, body).then(function (result) {
                return (result);
            });
        },
        deleteSectionDetail: function (endpoint, body) {
            return httpService.post(APIURL + endpoint, body).then(function (result) {
                return (result);
            });
        }
    }
});