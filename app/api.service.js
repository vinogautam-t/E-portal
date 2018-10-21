ePortalApp.factory('ApiService', function ($http, httpService, APIURL) {
	var apiService = {};

    apiService.startLoader = function(){
        document.getElementById("loading-screen").style.display = 'block';
    }

    apiService.stopLoader = function(){
        document.getElementById("loading-screen").style.display = 'none';
    }

    apiService.isLogin = function(){
        var userInfo = localStorage.getItem('userInfo');
        if(userInfo != undefined && userInfo != null){
            return true;
        }else{
            return false;
        }
    }

    apiService.getUserInfo = function(){
        return JSON.parse(localStorage.getItem('userInfo'));
    }
    
    apiService.login = function (data) {
        return httpService
        .post(APIURL+'?action=login', data);
    }

    apiService.forgot_password = function (data) {
        return httpService
        .post(APIURL+'?action=forgot_password', data);
    }

    apiService.reset_password = function (data) {
        return httpService
        .post(APIURL+'?action=reset_password', data);
    }

    apiService.getSections = function(){
        return httpService
        .get(APIURL+'?action=sections');
    }

    apiService.editSection = function(data){
        return httpService
        .post(APIURL+'?action=change_section', data);
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

    apiService.getChart = function(){
        var usr = this.getUserInfo();
        return httpService
        .get(APIURL+'?action=chart_details&id='+usr.id);
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

    apiService.getuserBasedRecordRoom = function(data){
        var usr = this.getUserInfo();
        return httpService
        .get(APIURL+'?action=register_report&id='+usr.id+'&startDate='+data.startDate+'&endDate='+data.endDate);
    }

    apiService.uploadOrderCopy = function(data){
        return httpService
        .post(APIURL+'?action=upload_order_copy', data);   
    }

    apiService.uploadConvertFile = function(data){
        return httpService
        .post(APIURL+'?action=upload_convert_file', data);   
    }

    apiService.moveToRecordRoom = function(data){
        return httpService
        .post(APIURL+'?action=move_to_record_room', data);
    }

    apiService.expired = function(data){
        return httpService
        .post(APIURL+'?action=expired', data);
    }

    return apiService;
});