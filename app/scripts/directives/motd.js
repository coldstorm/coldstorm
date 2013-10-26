Directives.directive("motd", function ()
{
    return {
        controller: "MotdCtrl",
        replace: true,
        restrict: "E",
        scope: { message: "=message", author: "=author", date: "=date" },
        templateUrl: "app/views/motd.html",
        transclude: true
    };
});
