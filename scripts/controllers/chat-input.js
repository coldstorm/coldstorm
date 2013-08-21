Controllers.controller("ChatInputCtrl", ["$scope", "$rootScope", function ($scope, $rootScope)
{
    $scope.submit = function ()
    {
        $rootScope.process($scope.input, $scope.tab);
    }
}]);