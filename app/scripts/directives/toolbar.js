Directives.directive("toolbar", function ()
{
    return {
        controller: "ToolbarCtrl",
        replace: true,
        restrict: "E",
        scope: { tab: "=tab" },
        templateUrl: "app/views/toolbar.html",
        transclude: true
    }
})