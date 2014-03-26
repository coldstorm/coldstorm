Controllers.controller("LinesCtrl", ["$scope", "$rootScope", function ($scope, $rootScope)
{
    $scope.$on("$destroy", function (event) {
        delete $scope.lines;
        delete $scope.channel;
    });

    $scope.limit = 250;

    $rootScope.$watch(function (scope)
    {
        if (scope.settings.BACKLOG_AMOUNT)
        {
            $scope.limit = scope.settings.BACKLOG_AMOUNT;
        }
    });
}]);
