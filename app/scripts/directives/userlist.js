Directives.directive("userlist", function ()
{
    return {
        controller: "UserListCtrl",
        replace: true,
        restrict: "E",
        scope: { users: "=users", channel: "=channel" },
        templateUrl: "app/views/userlist.html",
        transclude: true
    };
});
