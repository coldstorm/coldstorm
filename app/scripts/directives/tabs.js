Directives.directive("tabs", function ()
{
    return {
        controller: "TabsCtrl",
        replace: true,
        restrict: "E",
        templateUrl: "app/views/tabs.html",
    };
});
