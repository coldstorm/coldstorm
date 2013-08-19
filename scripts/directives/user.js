Directives.directive("user", function ()
{
    return {
        controller: "UserCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user", channel: "=channel", showOptions: "=options" },
        templateUrl: "views/user.html",
        transclude: true
    };
});