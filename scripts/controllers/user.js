Controllers.controller("UserCtrl", ["$scope", "$log", function ($scope, $log)
{
    $scope.$watch(function ()
    {
        return $scope.user.ranks[$scope.channel.name];
    }, function ()
    {
        $log.log($scope.user, $scope.channel, $scope.user.ranks,
            $scope.user.ranks[$scope.channel.name]);

        if ($scope.user != null &&
            $scope.user.ranks[$scope.channel.name] != null)
        {
            $scope.rank = $scope.user.ranks[$scope.channel.name][0];

            if ($scope.rank === '%')
            {
                $scope.rank = '#';
            }
        } else
        {
            $scope.rank = '';
        }
    });
}]);