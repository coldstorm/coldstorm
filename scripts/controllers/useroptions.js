Controllers.controller("UserOptionsCtrl", ["$scope", "$rootScope", "$location", "Query", "Connection",
function ($scope, $rootScope, $location, Query, Connection)
{
    $scope.query = function (user)
    {
        var query = Query.register(user.nickName);
        $location.path("/query/" + query.name);
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
