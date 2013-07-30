Directives.directive("useroptions", function ()
{
    return {
        controller: "UserOptionsCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user", showOptions: "=options" },
        templateUrl: "views/useroptions.html",
        transclude: true
    };
});