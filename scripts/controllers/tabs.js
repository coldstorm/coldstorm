Coldstorm.controller("TabsCtrl", ["$scope", function($scope)
{
    $scope.channelEquals = function(first, second)
    {
        console.log(first, second, first.name == second.name, first == second);
        return first.name == second.name;
    };
}]);
