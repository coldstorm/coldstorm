Coldstorm.directive("lines", function()
{
    return {
        controller: "LinesCtrl",
        replace: true,
        restrict: "E",
        scope: { lines: "=source" },
        templateUrl: "views/lines.html",
        transclude: true
    };
});
