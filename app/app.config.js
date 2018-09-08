ePortalApp
    .config(function ($locationProvider, $httpProvider) {
        //$locationProvider.html5Mode(true);
        $httpProvider.defaults.headers.post = { 'Content-Type': 'application/json' }
    })
    .value('APIURL', 'https://e-portal-api-vinogautam.c9users.io')

ePortalApp
    .directive('dynamic', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function (html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    })
    .directive('tooltipTitle', function () {
        return {
            restrict: 'A',
            scope: {
                tooltipTitle: '@',
                tooltipTitleVariable: '=',
                tooltipOptions: "="
            },
            link: function (scope, element, attrs) {
                var isTooltipDynamicVariable = (scope.tooltipTitleVariable !== undefined);

                if (!scope.tooltipTitle && !isTooltipDynamicVariable) {
                    return;
                }

                var tooltipOptions = scope.tooltipOptions || {};
                var message = scope.tooltipTitle;
                if (isTooltipDynamicVariable) {
                    message = scope.tooltipTitleVariable;
                    scope.$watch('tooltipTitleVariable', function (value) {
                        element.tooltipster('content', value);
                        if (!value) {
                            element.tooltipster('disable');
                        } else {
                            element.tooltipster('enable');
                        }
                    });
                }

                tooltipOptions.content = message;
                element.tooltipster(tooltipOptions);

                scope.$on("$destroy", function () {
                    element.tooltipster('destroy');
                })
            }
        }
    });

ePortalApp.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
ePortalApp.directive('hasPermission', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            console.log(scope.userInfo.userrole)
            if (scope.userInfo.userrole === 'admin') {
                element[0].hidden = false;
            } else {
                element[0].hidden = true;
            } 
            
        }
    }
})