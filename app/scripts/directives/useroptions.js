Directives.directive("useroptions", function ()
{
    return {
        controller: "UserOptionsCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user", channel: "=channel" },
        templateUrl: "app/views/useroptions.html",
        transclude: true
    };
});