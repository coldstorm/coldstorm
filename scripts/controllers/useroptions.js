Controllers.controller("UserOptionsCtrl", ["$scope", "$location",
function ($scope, $location)
{
    $scope.query = function (user)
    {
        $location.path("/query/" + user.nickName);
    };
}]);
