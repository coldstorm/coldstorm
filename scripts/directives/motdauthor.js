Directives.directive("motdAuthor", function ()
{
    return {
        controller: "MotdAuthorCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user" },
        templateUrl: "views/motdauthor.html",
        transclude: true
    }
});