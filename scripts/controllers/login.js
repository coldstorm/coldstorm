Coldstorm.controller("LoginCtrl", ["$scope", "$location", "UserService", function($scope, $location, User)
{
    $scope.user = User;
    
    $scope.login = function()
    {
        $location.path("/channels/#coldstorm");
    };
}]);
