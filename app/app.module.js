var ePortalApp = angular.module('app',
    ['ui.router', 'ui.bootstrap', 'datatables', 'ngAnimate']);
    
    
    ePortalApp.directive('ckEditor', [function () {
        return {
            require: '?ngModel',
            link: function ($scope, elm, attr, ngModel) {

                
                var ck = CKEDITOR.replace(elm[0] ,
                {
                    toolbar: [
                        { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','NumberedList', 'BulletedList' ] },
                        { name: 'paragraph', items : [ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ] },
                        { name: 'colors', items : [ 'TextColor','BGColor' ] },
                        '/',
                        { name: 'styles', items : [ 'Format'] },
                        { name: 'styles', items : [ 'Font']},
                        { name: 'styles', items : [ 'FontSize']},
                        { name: 'clipboard', items : [ 'Undo','Redo' ]}
                    ],
                    //skin: 'moono-dark',
                    font_names:'Arial/Arial, Helvetica, sans-serif;' +
                'Times New Roman/Times New Roman, Times, serif;' +
                'Bamini/Bamini',
                    fontSize_sizes:'8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px;',
                    format_tags: 'p;h1;h2;h3;h4;h5;h6',
                    colorButton_enableMore: false,
                    font_defaultLabel: 'Arial',
                    fontSize_defaultLabel: '14',
                    line_height:"1;1.1;1.2;1.3;1.4;1.5;1.6;1.7;1.8;1.9;2;3"
                });
                

                ck.on('pasteState', function () {
                    if(!$scope.$$phase) {
                        $scope.$apply(function () {
                            ngModel.$setViewValue(ck.getData());
                        });
                    }
                    else
                    {
                        ngModel.$setViewValue(ck.getData());
                    }
                });
            }
        };
    }]);
    
    ePortalApp.filter('unsafe', function($sce) { return $sce.trustAsHtml; });