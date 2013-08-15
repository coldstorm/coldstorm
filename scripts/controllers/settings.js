Controllers.controller("SettingsCtrl", ["$scope", "$cookies", "$filter", "$timeout", function ($scope, $cookies, $filter, $timeout)
{
    $scope.settings = ($cookies.settings);
    $scope.soundNotifications = false;
    $scope.desktopNotifications = false;
    $scope.saved = false

    if ($scope.settings)
    {
        $scope.settings = $.parseJSON($scope.settings);
        $scope.soundNotifications = $scope.settings.soundNotifications;
        $scope.desktopNotifications = $scope.settings.desktopNotifications;
    }

    $scope.saveSettings = function ()
    {
        var settings = {};
        settings.soundNotifications = $scope.soundNotifications;
        settings.desktopNotifications = $scope.desktopNotifications;
        $cookies.settings = $filter("json")(settings);
        $scope.saved = true;

        $timeout(function () { $scope.saved = false; }, 1500);
    };
}]);