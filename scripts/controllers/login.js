Coldstorm.controller("LoginCtrl", ["$scope", "$location", "User", "Channel", function($scope, $location, User, Channel)
{
    $scope.user = User.get("~");
    
    $scope.login = function()
    {
        Channel.register("#coldstorm").addLine("Testing line colors", $scope.user);
        Channel.register("#2");
        
        $location.path("/channels/#coldstorm");
    };
}]);
