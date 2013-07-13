Coldstorm.controller("ChannelCtrl", ["$scope", "$routeParams", "$location",
    "User", "Channel", function($scope, $routeParams, $location, User, Channel)
{
    var channelName = $routeParams.channelName
    
    // Handle hashes in the URI representing the start of channel names
    
    if (!channelName)
    {
        channelName = "#" + $location.hash();
    }
    
    $scope.channel = Channel.get(channelName);
    
    $scope.$watch("channel.active", function()
    {
        $scope.channel.active = false;
    });
    
    $scope.$on("channel.close", function(evt, channel)
    {
        if (channel == $scope.channel)
        {
            var channels = $scope.channels;
            
            if (channels.length > 1)
            {
                $location.path("/channels/" + channels[0].name);
            }
        }
    });
    
    $scope.user = User.get("~");
    
    $scope.$watch(function()
    {
        $scope.channels = Channel.all();
    });
}]);
