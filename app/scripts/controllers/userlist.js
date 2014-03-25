Controllers.controller("UserListCtrl", ["$scope", function ($scope)
{
    $scope.$on("$destroy", function () {
        delete $scope.users;
        delete $scope.selectedUser;
    });

    $scope.selectedUser = null;
}]);
