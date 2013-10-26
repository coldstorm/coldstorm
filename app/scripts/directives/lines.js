Directives.directive("lines", function ()
{
    return {
        controller: "LinesCtrl",
        replace: true,
        restrict: "E",
        scope: { lines: "=lines", channel: "=channel" },
        templateUrl: "views/lines.html",
        transclude: true
    };
});
