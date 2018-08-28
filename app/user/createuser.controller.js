ePortalApp.controller("UserController", function ($scope, $window, $http, $timeout, $rootScope, $stateParams, $uibModal, UserService) {
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

    $scope.deleteInfo = function (userId, index) {
        var req =
            {
                "handle": "delete",
                "id": Number(userId)
            };
        UserService.deleteUserDetail('?action=user_action', req).then(function (resp) {
            if (resp.status === 'success') {
                toastr.success("User Deleted Successfully");
                $scope.userList.splice(index, 1);
            } else {
                toastr.warning("User deleting failed, Please try after sometime.");
            }
        }, function err() {
            console.log('err')
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
    { "id": "csr", "value": "CSR" }, { "id": "dr", "value": "DR" }, { "id": "pr", "value": "PR" }];



    $scope.submitForm = function () {
        var req =
            {
                "handle": $scope.action,
                "username": $scope.user.username,
                "email": $scope.user.email,
                "firstname": $scope.user.firstName,
                "lastname": $scope.user.lastName,
                "userrole": $scope.user.role,
                "section": $scope.user.roleAccess
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
                // $state.go('listUser');
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
            $scope.sectionList = $filter('filter')(resp.data, { 'type': 'section' });
            if ($scope.info.user) {
                var sections = $scope.info.user.section.split(',');
                if (sections.length === 1) {
                    $scope.user.roleAccess = $scope.info.user.section;
                } else {

                }

            }

        }, function err() {
            console.log('err')
        });
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
            // $scope.user.roleAccess = Number(userObject.section);
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

