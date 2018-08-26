ePortalApp.factory('ApiService', function ($http, httpService, APIURL) {
	var apiService = {};

    apiService.startLoader = function(){
        document.getElementById("loading-screen").style.display = 'block';
    }

    apiService.stopLoader = function(){
        document.getElementById("loading-screen").style.display = 'none';
    }

    apiService.getUserInfo = function(){
        return JSON.parse(localStorage.getItem('userInfo'));
    }
    
    apiService.login = function (data) {
        return httpService
        .post(APIURL+'?action=login', data);
    }

    apiService.getSections = function(){
        return httpService
        .get(APIURL+'?action=sections');
    }

    apiService.createFiles = function(data){
        return httpService
        .post(APIURL+'?action=create_file', data);
    }

    apiService.getFiles = function(){
        var usr = this.getUserInfo();
        return httpService
        .get(APIURL+'?action=dashboard_files&id='+usr.id);
    }

    return apiService;
});