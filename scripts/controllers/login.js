Coldstorm.controller("LoginCtrl", ["$scope", "$location", "User", "Channel", function($scope, $location, User, Channel)
{
    $scope.user = User.get("~");
    
    $scope.login = function()
    {
        Channel.register("#coldstorm");
        
        $location.path("/channels/#coldstorm");
    };
}]);
