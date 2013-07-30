Controllers.controller("TabsCtrl", ["$scope", function ($scope)
{
    $scope.$on("channel.message", function (evt, message)
    {
        // Don't set the channel to active if it is the current channel

        if ($scope.channel == message.channel)
        {
            return;
        }

        $scope.$apply(function ()
        {
            message.channel.active = true;
        })
    });

    $scope.channelEquals = function (first, second)
    {
        return first.name == second.name;
    };
}]);
