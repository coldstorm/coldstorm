Controllers.controller("ToolbarCtrl", ["$scope", "$rootScope", "Connection", "User", "Settings", function ($scope, $rootScope, Connection, User, Settings)
{
    $scope.notification = "This is a test notification.";

    $scope.user = User.get("~");

    $scope.settings = $.parseJSON($.cookie("settings") || "{}");

    $rootScope.settings = $scope.settings;

    $scope.dismissNotification = function ()
    {
        $scope.notification = "";
    }

    $scope.setAway = function ()
    {
        if ($scope.user.awayMsg)
        {
            Connection.send("AWAY")
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
    }

    $scope.rejoin = function (tab)
    {
        Connection.send("PART " + tab.name + " :rejoining");
        Connection.send("JOIN " + tab.name)
    }

    $scope.clearLines = function (tab)
    {
        tab.clear();
    }

    $rootScope.$watch(function (scope)
    {
        Settings.save($scope.settings);

        scope.settings = $scope.settings;
    });
}])