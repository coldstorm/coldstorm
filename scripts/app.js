var Controllers = angular.module("coldstorm.controllers", []);
var Directives = angular.module("coldstorm.directives", ["luegg.directives"]);
var Services = angular.module("coldstorm.services", []);
var Filters = angular.module("coldstorm.filters", []);
var Coldstorm = angular.module("coldstorm", ["colorpicker.module", "ui.bootstrap", "coldstorm.controllers", "coldstorm.directives", "coldstorm.services",
    "coldstorm.filters", "ngSanitize", "ngCookies"]);
var VERSION = "not-loaded";

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
        when("/settings", {
            templateUrl: "views/settings.html",
            controller: "SettingsCtrl"
        }).
        otherwise({
            redirectTo: "/login"
        });
}]).run(["$http", "$location", "$rootScope",
function ($http, $location, $rootScope)
{
    if ($location.host().indexOf("localhost") === -1)
    {
        $http.get("https://api.github.com/repos/coldstorm/coldstorm/commits" +
            "?per_page=1").success(function (data)
            {
                VERSION = data[0].sha;
                $rootScope.meta.version = VERSION;
                $rootScope.meta.shortHash = VERSION.substring(0, 7);
            });
    } else
    {
        VERSION = "local";
    }

    var clearNotifications = function ()
    {
        $rootScope.$broadcast("read");
    }

    window.onclick = function ()
    {
        $rootScope.blurred = false;
        clearNotifications();
    };

    window.onkeyup = function ()
    {
        $rootScope.blurred = false;
        clearNotifications();
    };

    window.onfocus = function ()
    {
        $rootScope.blurred = false;
        clearNotifications();
    };

    window.onblur = function ()
    {
        $rootScope.blurred = true;
    };

    $rootScope.blurred = false;

    $rootScope.meta = {
        version: VERSION,
        shortHash: VERSION
    };
}]);
