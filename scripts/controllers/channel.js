Coldstorm.controller("ChannelCtrl", ["$scope", "$routeParams", "UserService", "Channel", function($scope, $routeParams, User, Channel)
{
    $scope.channel = Channel.get($routeParams.channelName);
    $scope.user = User;
}]);
