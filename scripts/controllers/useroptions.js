Controllers.controller("UserOptionsCtrl", ["$scope", "$rootScope", "$location", "User", "Query", "Connection",
function ($scope, $rootScope, $location, User, Query, Connection)
{
    $scope.getRank = function ()
    {
        var myUser = User.get("~");

        if (myUser.ranks[$scope.channel.name])
        {
            switch (myUser.ranks[$scope.channel.name][0])
            {
                case '@': return 2;
                    break;
                case '%': return 1;
                    break;
                case '+':
                default: return 0;
                    break;
            }
        }
    }

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
