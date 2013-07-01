Coldstorm.directive("userlist", function()
{
    return {
        controller: "UserListCtrl",
        replace: true,
        restrict: "E",
        scope: { users: "=source" },
        templateUrl: "views/userlist.html",
        transclude: true
    };
});
