Coldstorm.controller("TabsCtrl", ["$scope", function($scope)
{
    $scope.channelEquals = function(first, second)
    {
        return first.name == second.name;
    };
}]);
