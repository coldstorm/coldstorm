Controllers.controller("UserOptionsCtrl", ["$scope", "$rootScope", "$location", "Query",
function ($scope, $rootScope, $location, Query)
{
    $scope.query = function (user)
    {
        var query = Query.register(user.nickName);
        $location.path("/query/" + query.name);
    };
}]);
