Directives.directive("lineAuthor", function ()
{
    return {
        controller: "LineAuthorCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user", channel: "=channel" },
        templateUrl: "app/views/line-author.html",
        transclude: true
    }
});