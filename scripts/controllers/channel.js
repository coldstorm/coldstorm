Coldstorm.controller("ChannelCtrl", ["$scope", "$routeParams", "User", "Channel", function($scope, $routeParams, User, Channel)
{
    $scope.channel = Channel.get($routeParams.channelName);
    $scope.user = User.get("~");
    
    $scope.channels = Channel.all();
}]);
