Controllers.controller("ToolbarCtrl", ["$scope", "Connection", "User", function ($scope, Connection, User)
{
    $scope.user = User.get("~");

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
}])