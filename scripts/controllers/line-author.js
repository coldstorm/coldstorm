﻿Controllers.controller("LineAuthorCtrl", ["$scope", function ($scope)
{
    if ($scope.user != null &&
        $scope.user.ranks[$scope.channel.name] != null)
    {
        $scope.rank = $scope.user.ranks[$scope.channel.name][0];
    } else
    {
        $scope.rank = '';
    }
}]);