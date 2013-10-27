Controllers.controller("ToolbarCtrl", ["$scope", "$rootScope", "Connection", "User", "Settings", function ($scope, $rootScope, Connection, User, Settings)
{
    $scope.user = User.get("~");

    $scope.settings = $.parseJSON($.cookie("settings") || "{}");

    $rootScope.settings = $scope.settings;

    $scope.setAway = function ()
    {
        if ($scope.user.awayMsg)
        {
            Connection.send("AWAY")
            $scope.user.awayMsg = "";
        } else
        {
            Connection.send("AWAY :afk")
            $scope.user.awayMsg = "afk";
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