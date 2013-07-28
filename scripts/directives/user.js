Coldstorm.directive("user", function ()
{
    return {
        controller: ["$scope", function ($scope)
        {
            if ($scope.user != null &&
                $scope.user.ranks != null &&
                $scope.channel != null &&
                $scope.user.ranks[$scope.channel.name] != null &&
                $scope.user.ranks[$scope.channel.name].length != 0)
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
        }],
        replace: true,
        restrict: "E",
        scope: { user: "=user", channel: "=channel", showOptions: "=options" },
        templateUrl: "views/user.html",
        transclude: true
    };
});