Directives.directive("lines", function ()
{
    return {
        controller: "LinesCtrl",
        replace: true,
        restrict: "E",
        scope: { lines: "=lines", channel: "=channel" },
        templateUrl: "app/views/lines.html",
        transclude: true
    };
});
