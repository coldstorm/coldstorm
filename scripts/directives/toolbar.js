Directives.directive("toolbar", function ()
{
    return {
        controller: "ToolbarCtrl",
        replace: true,
        restrict: "E",
        scope: { channel: "=channel" },
        templateUrl: "views/toolbar.html",
        transclude: true
    }
})