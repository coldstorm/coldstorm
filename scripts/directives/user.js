Coldstorm.directive("user", function()
{
    return {
        controller: ["$scope", function($scope) {
                if ($scope.user.ranks != null && $scope.channel != null) 
                {
                    $scope.rank = $scope.user.ranks[$scope.channel.name]
                } else {
                    $scope.rank = "";
                }
            }],
        replace: true,
        restrict: "E",
        scope: { user: "=user", channel: "=channel" },
        templateUrl: "views/user.html",
        transclude: true
    };
});