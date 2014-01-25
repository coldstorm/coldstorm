Controllers.controller("LinesCtrl", ["$scope", "$rootScope", function ($scope, $rootScope)
{
    $rootScope.$watch(function (scope)
    {
        $scope.limit = scope.settings.BACKLOG_AMOUNT;
    });
}]);
