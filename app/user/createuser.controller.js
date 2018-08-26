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
ePortalApp.controller("AddUserController", function ($scope, $filter, $window, $http, $timeout, $rootScope, $state, $stateParams, $uibModal, UserService,SectionService) {

    $scope.userId = $stateParams.id;
    $scope.action = "add";
    $scope.saveBtnAction = "Create";
    $scope.successMsg = "User created Successfully";
    $scope.errorMsg = "User creating failed";
    $scope.user = {
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
    // $scope.sectionList = [{ "id": 1, "value": "Section1" },
    // { "id": 2, "value": "Section2" }, { "id": 3, "value": "Section3" }, { "id": 4, "value": "Section4" }];
    // $scope.roleList = [{ "id": 1, "value": "Attender" },
    // { "id": 2, "value": "CSR" }, { "id": 3, "value": "DR" }, { "id": 4, "value": "PR" }];

    $scope.roleList = [{ "id": "attender", "value": "Attender" },
    { "id": "csr", "value": "CSR" }, { "id": "dr", "value": "DR" }, { "id": "pr", "value": "PR" }];



    $scope.submitForm = function () {
        var req =
            {
                "handle": $scope.action,
                "username": $scope.user.firstName,
                "email": $scope.user.email,
                "firstname": $scope.user.firstName,
                "lastname": $scope.user.lastName,
                "password": $scope.user.password,
                "userrole": $scope.user.role,
                "section": $scope.user.roleAccess
            };
        if ($scope.userId) {
            req['id'] = $scope.userId;
        }

        UserService.addUserDetail('?action=user_action', req).then(function (resp) {
            if (resp.status === 'success') {
                toastr.success($scope.successMsg);
                $state.go('listUser');
            } else {
                toastr.warning($scope.errorMsg +", Please try after sometime.");
            }
        }, function err() {
            toastr.warning("Service failed, Please try after sometime.");
        });
    }

    $scope.getUserList = function () {
        UserService.getUserList('?action=users').then(function (resp) {
            var userObject = $filter('filter')(resp.data, {
                id: $scope.userId
            })[0];

            $scope.user.firstName = userObject.firstname;
            $scope.user.lastName = userObject.lastname;
            $scope.user.email = userObject.email;
            $scope.user.role = userObject.userrole;
            $scope.user.roleAccess = userObject.section;
        }, function err() {
            console.log('err')
        });
    }

    $scope.getSectionList = function () {
        SectionService.getSectionList('?action=sections').then(function (resp) {
            $scope.sectionList = resp.data;
        }, function err() {
            console.log('err')
        });
    }

    $scope.findActionType = function () {
        if ($scope.userId) {
            $scope.action = 'edit';
            $scope.saveBtnAction = "Update";
            $scope.successMsg = "User updated Successfully";
            $scope.errorMsg = "User updating failed";
            $scope.getUserList();
        }
        $scope.getSectionList();

    };

    $scope.findActionType();

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
        editUserDetail: function (endpoint, body) {
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

