Controllers.controller("ToolbarCtrl", ["$scope", "Connection", "User", function ($scope, Connection, User)
{
    $scope.user = User.get("~");

    $scope.showBanlist = function (channel)
    {
        Connection.send("MODE " + channel.name + " b");
    }

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
}])