Coldstorm.controller("ChannelCtrl", ["$scope", "$routeParams", "$location", "User", "Channel", function($scope, $routeParams, $location, User, Channel)
{
    var channelName = $routeParams.channelName
    if (!channelName)
    {
        channelName = "#" + $location.hash();
    }
    
    $scope.channel = Channel.get(channelName);
    $scope.channel.active = false;
    
    $scope.user = User.get("~");
    
    $scope.channels = Channel.all();
}]);
