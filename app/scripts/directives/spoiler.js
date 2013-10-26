Directives.directive("spoiler", function ()
{
    return {
        controller: "SpoilerCtrl",
        replace: true,
        restrict: "E",
        scope: { text: "=text" },
        templateUrl: "app/views/spoiler.html",
        transclude: true
    };
});