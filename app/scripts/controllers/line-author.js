Controllers.controller("LineAuthorCtrl", ["$scope", function ($scope)
{
    $scope.$on("$destroy", function (event) {
        delete $scope.user
        delete $scope.channel;
        delete $scope.rank;
    });

    if ($scope.user != null &&
        $scope.channel != null &&
        $scope.user.ranks[$scope.channel.name] != null)
    {
        $scope.rank = $scope.user.ranks[$scope.channel.name][0];

        if ($scope.rank === '%')
        {
            $scope.rank = '#';
        }

        if ($scope.rank === '&' || $scope.rank === '~')
        {
            $scope.rank = '@';
        }
    } else
    {
        $scope.rank = '';
    }
}]);
