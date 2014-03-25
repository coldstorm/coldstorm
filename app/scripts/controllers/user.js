Controllers.controller("UserCtrl", ["$scope", "$log", function ($scope, $log)
{
    $scope.$on("$destroy", function (event) {
        $scope.user = null;
        $scope.selectedUser = null;
    });

    $scope.toggleOptions = function ()
    {
        if ($scope.selectedUser)
        {
            $scope.selectedUser = null;
        } else
        {
            $scope.selectedUser = $scope.user;
        }
    }

    $scope.$watch(function ()
    {
        return $scope.user.ranks[$scope.channel.name];
    }, function ()
    {
        if ($scope.user != null &&
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
        }

        else
        {
            $scope.rank = '';
        }
    });
}]);
