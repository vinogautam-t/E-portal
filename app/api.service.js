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

    apiService.addNotes = function(data){
        return httpService
        .post(APIURL+'?action=move_to_csr', data);
    }

    apiService.fileProcess = function(data, action, role){
        if(role == 'dr'){
            if(action == 'approve'){
                return httpService
                .post(APIURL+'?action=dr_confirmed', data);
            }else if(action == 'decline'){
                return httpService
                .post(APIURL+'?action=dr_rejected', data);
            }
        }else if(role == 'csr'){
            if(action == 'approve'){    
                return httpService
                .post(APIURL+'?action=csr_confirmed', data);
            }else if(action == 'decline'){
                return httpService
                .post(APIURL+'?action=csr_rejected', data);
            }
        }
    }

    apiService.getFileInfo = function(id){
        return httpService
        .get(APIURL+'?action=single_register&id='+id);
    }

    apiService.getRecordRoomInfo = function(){
        return httpService
        .get(APIURL+'?action=record_room_report');
    }

    return apiService;
});