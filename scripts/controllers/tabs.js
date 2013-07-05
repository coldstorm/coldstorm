Coldstorm.controller("TabsCtrl", ["$scope", function($scope)
{
    $scope.$on("channel.message", function(evt, args)
    {
        // Don't set the channel to active if it is the current channel
        
        if ($scope.channel == args.channel)
        {
            return;
        }
        
        args.channel.active = true;
    });
    
    $scope.channelEquals = function(first, second)
    {
        return first.name == second.name;
    };
}]);
