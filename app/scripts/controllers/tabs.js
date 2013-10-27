Controllers.controller("TabsCtrl", ["$scope", function ($scope)
{
    $scope.$on("channel.message", function (evt, message)
    {
        // Don't set the channel to active if it is the current channel

        if ($scope.channel !== undefined && $scope.channel == message.channel)
        {
            return;
        }

        $scope.$apply(function ()
        {
            message.channel.active = true;
        });
    });

    $scope.$on("query.message", function (evt, message)
    {
        if ($scope.query !== undefined && $scope.query == message.query)
        {
            return;
        }

        $scope.$apply(function ()
        {
            message.query.active = true;
        });
    });

    $scope.channelEquals = function (first, second)
    {
        if (first === undefined || second === undefined)
        {
            return false;
        }
        
        return first.name == second.name;
    };

    $scope.queryEquals = function (first, second)
    {
        if (first === undefined || second === undefined)
        {
            return false;
        }

        return first.user.nickName == second.user.nickName;
    }

    $scope.ytEquals = function (first, second)
    {
        if (first === undefined || second === undefined)
        {
            return false;
        }

        return first.id === second.id;
    }
}]);
