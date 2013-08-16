Controllers.controller("SettingsCtrl", ["$scope", "$cookies", "$timeout", "Settings", function ($scope, $cookies, $timeout, Settings)
{
    $scope.saved = false;
    $scope.soundNotifications = Settings.get("soundNotifications");
    $scope.desktopNotifications = Settings.get("desktopNotifications");

    $scope.saveSettings = function ()
    {
        Settings.set("desktopNotifications", $scope.desktopNotifications);
        Settings.set("soundNotifications", $scope.soundNotifications);
        $scope.saved = true;

        $timeout(function () { $scope.saved = false; }, 1500);
    };
}]);