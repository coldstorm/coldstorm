Coldstorm.directive("tabs", function()
{
    return {
        controller: "TabsCtrl",
        replace: true,
        restrict: "E",
        templateUrl: "views/tabs.html",
    };
});
