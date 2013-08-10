var Controllers = angular.module("coldstorm.controllers", []);
var Directives = angular.module("coldstorm.directives", ["luegg.directives"]);
var Services = angular.module("coldstorm.services", []);
var Filters = angular.module("coldstorm.filters", []);
var Coldstorm = angular.module("coldstorm", ["colorpicker.module", "coldstorm.controllers", "coldstorm.directives", "coldstorm.services", "coldstorm.filters"]);

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
        when("/query/:nickName", {
            templateUrl: "views/query.html",
            controller: "QueryCtrl"
        }).
        otherwise({
            redirectTo: "/login"
        });
}]);
