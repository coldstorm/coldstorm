Coldstorm.directive("motd", function()
{
    return {
        controller: "MotdCtrl",
        replace: true,
        restrict: "E",
        scope: { message: "=source" },
        templateUrl: "views/motd.html",
        transclude: true
    };
});
