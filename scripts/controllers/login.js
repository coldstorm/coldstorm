Coldstorm.controller("LoginCtrl", ["$scope", "$rootScope", "$location", "$timeout", "User", "Channel", function($scope, $rootScope, $location, $timeout, User, Channel)
{
    $scope.user = User.get("~");
    
    $scope.login = function()
    {
        var cs = Channel.register("#Coldstorm")
            .addLine("Testing line colors", $scope.user)
            .addUser($scope.user);
        var two = Channel.register("#2");
        
        $timeout(function()
        {
            // Fire the messages after a second so the directive loads
            
            $rootScope.$broadcast("channel.message", { channel: cs });
            $rootScope.$broadcast("channel.message", { channel: two });
        }, 1000);
        
        $location.path("/channels/#Coldstorm");
    };
}]);
