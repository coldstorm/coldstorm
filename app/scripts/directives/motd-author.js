Directives.directive("motdAuthor", function ()
{
    return {
        controller: "MotdAuthorCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user" },
        templateUrl: "app/views/motd-author.html",
        transclude: true
    }
});