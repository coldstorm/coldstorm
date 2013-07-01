Coldstorm.controller("LoginCtrl", ["$scope", "$location", "User", "Channel", function($scope, $location, User, Channel)
{
    $scope.user = User.get("~");
    
    $scope.login = function()
    {
        var cs = Channel.register("#coldstorm")
            .addLine("Testing line colors", $scope.user)
            .addUser($scope.user);
        var two = Channel.register("#2");
        
        $location.path("/channels/#coldstorm");
    };
}]);
