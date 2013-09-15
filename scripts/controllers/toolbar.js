Controllers.controller("ToolbarCtrl", ["$scope", "Connection", function ($scope, Connection)
{
    $scope.showBanlist = function (channel)
    {
        Connection.send("MODE " + channel.name + " b");
    }
}])