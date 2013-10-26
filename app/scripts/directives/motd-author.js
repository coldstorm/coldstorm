Directives.directive("motdAuthor", function ()
{
    return {
        controller: "MotdAuthorCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user" },
        templateUrl: "views/motd-author.html",
        transclude: true
    }
});