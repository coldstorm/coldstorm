Directives.directive("spoiler", function ()
{
    return {
        controller: "SpoilerCtrl",
        replace: true,
        restrict: "E",
        scope: { text: "=text" },
        templateUrl: "views/spoiler.html",
        transclude: true
    };
});