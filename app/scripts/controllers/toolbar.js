Controllers.controller("ToolbarCtrl", 
["$scope", "$rootScope", "Connection", "User", "Settings", "AppNotification", "Channel",
function ($scope, $rootScope, Connection, User, Settings, AppNotification, Channel)
{
    $scope.user = User.get("~");

    $scope.settings = $.parseJSON($.cookie("settings") || "{}");

    $rootScope.settings = $scope.settings;

    $scope.appNotification = $rootScope.appNotification;

    $scope.dismissNotification = function ()
    {
        AppNotification.dismiss();
    };

    $scope.setAway = function ()
    {
        if ($scope.user.awayMsg)
        {
            Connection.send("AWAY");
            $scope.user.awayMsg = "";
        } 

        else
        {
            if ($rootScope.settings.AWAY_MESSAGE)
            {
                Connection.send("AWAY :" + $rootScope.settings.AWAY_MESSAGE);
                $scope.user.awayMsg = $rootScope.settings.AWAY_MESSAGE;
            }

            else
            {
                Connection.send("AWAY :afk");
                $scope.user.awayMsg = "afk";
            }
        }
    };

    $scope.rejoin = function (tab)
    {
        var channel = Channel.get(tab.name);
        if (channel.connected) channel.close("rejoining");
        channel.join();
    };

    $scope.clearLines = function (tab)
    {
        tab.clear();
    };

    $rootScope.$watch(function (rootScope)
    {
        Settings.save($scope.settings);

        rootScope.settings = $scope.settings;
        $scope.appNotification = rootScope.appNotification;
    });
}]);