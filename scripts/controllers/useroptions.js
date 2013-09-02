Controllers.controller("UserOptionsCtrl", ["$scope", "$rootScope", "$location", "Query", "Connection",
function ($scope, $rootScope, $location, Query, Connection)
{
    $scope.query = function (user)
    {
        var query = Query.register(user.nickName);
        $location.path("/query/" + query.name);
    };

    $scope.setmode = function (user, mode)
    {
        Connection.send("MODE " + $scope.channel.name + " " + mode + " " + user.nickName);
    };

    $scope.strip = function (user)
    {
        Connection.send("MODE " + $scope.channel.name + " -vho "
            + user.nickName + " " + user.nickName + " " + user.nickName);
    };

    $scope.kick = function (user)
    {
        Connection.send("KICK " + $scope.channel.name + " " + user.nickName);
    };

    $scope.ban = function (user)
    {
        Connection.send("MODE " + $scope.channel.name + " +b " + user.nickName);
    };
}]);
