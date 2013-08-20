Directives.directive("useroptions", function ()
{
    return {
        controller: "UserOptionsCtrl",
        replace: true,
        restrict: "E",
        scope: { user: "=user" },
        templateUrl: "views/useroptions.html",
        transclude: true
    };
});