ePortalApp.controller("UserController", function ($scope, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, UserService) {
    $scope.userList = [];

    $scope.getUserList = function () {
        UserService.getUserList('?action=users').then(function (resp) {
            $scope.userList = resp.data;
        }, function err() {
            console.log('err')
        });
    }
    $scope.getUserList();

    $scope.addUser = function () {
        var data = { 'title': 'Add User', 'module': 'adduser' };
        $scope.toggleModal('md', data);
    }

    $scope.editUser = function (userData) {
        var data = { 'title': 'Edit User', 'module': 'edituser', 'user': userData };
        $scope.toggleModal('md', data);
    }
    $scope.toggleModal = function (size, data) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'loadUser',
            controller: 'UserActionController',
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

    $scope.openDeleteModal = function (userId, index) {
        $scope.deleteUser = {"userId": userId, 'selectedIndex': index};
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'deleteUser',
            size: 'md',
            scope: $scope
       });
       $scope.modalInstance = modalInstance;
    }

      $scope.confirmDelete = function () {
        $scope.modalInstance.close('Yes Button Clicked')
        $scope.deleteInfo();
      };
  
      // Dismiss the modal if No button click
      $scope.cancelDelete = function () {
        $scope.modalInstance.dismiss('cancel');
      };

    $scope.deleteInfo = function () {
        var req =
            {
                "handle": "delete",
                "id": Number($scope.deleteUser.userId)
            };
        UserService.deleteUserDetail('?action=user_action', req).then(function (resp) {
            if (resp.status === 'success') {
                toastr.success("User Deleted Successfully");
                $scope.userList.splice( $scope.deleteUser.selectedIndex, 1);
            } else {
                toastr.warning("User deleting failed, Please try after sometime.");
            }
            $scope.deleteUser = undefined;
        }, function err() {
            console.log('err')
            toastr.warning("Service failed, Please try after sometime.");
            $scope.deleteUser = undefined;
        }); 
    }

    $scope.updateStatus = function (userId, status) {
        var msg = status === '0' ? 'In activation' : 'Activation';
        var req =
            {
                "handle": 'edit',
                "status": status,
                "id": userId
            };
        $scope.successMsg = 'User ' + msg + ' Successfully';
        $scope.errorMsg = 'User ' + msg + ' failed';
        UserService.addUserDetail('?action=user_action', req).then(function (resp) {
            if (resp.status === 'success') {
                toastr.success($scope.successMsg);
                $state.reload();
            } else {
                toastr.warning($scope.errorMsg + ", Please try after sometime.");
            }
        }, function err() {
            toastr.warning("Service failed, Please try after sometime.");
        });

    }

});
ePortalApp.controller("UserActionController", function ($scope, $filter, $window, $http, $timeout, $uibModal, UserService, SectionService, info, $uibModalInstance, $state) {
    $scope.info = info;
    $scope.action = 'add';
    $scope.saveBtnAction = "Create";
    $scope.successMsg = "User created Successfully";
    $scope.errorMsg = "User creating failed";
    $scope.user = {
        "username": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "password": "",
        "phoneNo": "",
        "role": "",
        "roleAccess": 0
    }
    $scope.ph_numbr = /^\+?\d{10}$/;
    $scope.eml_add = /^[^\s@]+@[^\s@]+\.[^\s@]/;
    $scope.roleList = [{ "id": "attender", "value": "Attender" },
    { "id": "csr", "value": "CSR" }, { "id": "dr", "value": "DR" }, { "id": "pr", "value": "Section" }];



    $scope.submitForm = function () {
        var userRole = [];
        if ($scope.user.role === 'csr') {
            var sectionLst = $filter('filter')($scope.sectionList, { 'val': true });
            var userRole = [];
            angular.forEach(sectionLst, function (data, i) {
                userRole.push(data.id)
            });
        } else if ($scope.user.role === 'pr') {
            userRole.push($scope.user.roleAccess);
        }
        var req =
            {
                "handle": $scope.action,
                "username": $scope.user.username,
                "email": $scope.user.email,
                "firstname": $scope.user.firstName,
                "lastname": $scope.user.lastName,
                "userrole": $scope.user.role,
                "section": userRole
            };
        if ($scope.userId) {
            req['id'] = $scope.userId;
        } else {
            req['password'] = $scope.user.password;
        }

        UserService.addUserDetail('?action=user_action', req).then(function (resp) {
            if (resp.status === 'success') {
                toastr.success($scope.successMsg);
                $uibModalInstance.dismiss('cancel');
                $state.reload();
            } else {
                toastr.warning($scope.errorMsg + ", Please try after sometime.");
            }
        }, function err() {
            toastr.warning("Service failed, Please try after sometime.");
        });
    }

    $scope.getSectionList = function () {
        SectionService.getSectionList('?action=sections').then(function (resp) {
            // var sectionLst = $filter('filter')(resp.data, { 'type': 'section' });
            $scope.sectionList = [];
            angular.forEach(resp.data, function (data, i) {
                var dt = data;
                var preSelectedSections = ($scope.info.user) ? $scope.info.user.section : [];
                if (preSelectedSections.includes(dt.id)) {
                    dt["val"] = true;
                } else {
                    dt["val"] = false;
                }
                $scope.sectionList.push(data);
            });
            if ($scope.info.user && $scope.user.role === 'pr' && $scope.info.user.section.length === 1) {
                $scope.user.roleAccess = $scope.info.user.section[0];
            }
        }, function err() {
            console.log('err')
        });
    }
    $scope.selectedValue = function (value, index) {
        $scope.sectionList[index].val = !!value;
    }

    $scope.findActionType = function () {
        $scope.getSectionList();
        if ($scope.info.user) {
            var userObject = $scope.info.user;
            $scope.action = 'edit';
            $scope.saveBtnAction = "Update";
            $scope.successMsg = "User updated Successfully";
            $scope.errorMsg = "User updating failed";
            $scope.user.username = userObject.username;
            $scope.user.firstName = userObject.firstname;
            $scope.user.lastName = userObject.lastname;
            $scope.user.email = userObject.email;
            $scope.user.role = userObject.userrole;
            $scope.userId = userObject.id;
        }
    };

    $scope.findActionType();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

ePortalApp.factory('UserService', function (httpService, APIURL) {

    return {
        getUserList: function (endpoint) {
            return httpService.get(APIURL + endpoint).then(function (result) {
                return (result.data) ? result.data : [];
            });
        },
        addUserDetail: function (endpoint, body) {
            return httpService.post(APIURL + endpoint, body).then(function (result) {
                return (result);
            });
        },
        deleteUserDetail: function (endpoint, body) {
            return httpService.post(APIURL + endpoint, body).then(function (result) {
                return (result);
            });
        }
    }
});

