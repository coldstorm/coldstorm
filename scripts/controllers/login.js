Coldstorm.controller("LoginCtrl", ["$scope", "$location", "User", "Channel", function($scope, $location, User, Channel)
{
    $scope.user = User.get("~");
    
    $scope.login = function()
    {
        Channel.register("#coldstorm");
        Channel.register("#2");
        
        $location.path("/channels/#coldstorm");
    };
}]);
