var Coldstorm = angular.module("coldstorm", ['colorpicker.module']);

Coldstorm.config(["$routeProvider", function ($routeProvider)
{
    $routeProvider.
        when("/login", {
            templateUrl: "views/login.html",
            controller: "LoginCtrl"
        }).
        when("/channels/:channelName", {
            templateUrl: "views/channel.html",
            controller: "ChannelCtrl"
        }).
        otherwise({
            redirectTo: "/login"
        });
}]);
