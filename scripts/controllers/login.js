Coldstorm.controller("LoginCtrl", ["$scope", "$location", "UserService", "Channel", function($scope, $location, User, Channel)
{
    $scope.user = User;
    
    $scope.login = function()
    {
        Channel.register("#coldstorm");
        
        $location.path("/channels/#coldstorm");
    };
}]);
