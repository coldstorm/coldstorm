Directives.directive("user", function ()
{
    return {
        controller: "UserCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user", channel: "=channel", selectedUser: "=?selectedUser" },
        templateUrl: "views/user.html",
        transclude: true
    };
});