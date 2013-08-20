Controllers.controller("UserOptionsCtrl", ["$scope", "$rootScope", "$location",
function ($scope, $rootScope, $location)
{
    $scope.query = function (user)
    {
        $location.path("/query/" + user.nickName);
    };
}]);
