Services.factory("Settings",
["$timeout", "$filter", "$rootScope",
function ($timeout, $filter, $rootScope)
{
    var settingsFactory = {
        save: function (value)
        {
            $.cookie("settings", $filter("json")(value), { expires: new Date(2017, 00, 01) });
        }
    };

    $rootScope.settings = $.parseJSON($.cookie("settings") || "{}");
    
    // migrate old settings
    if ($rootScope.settings["desktopNotifications"])
    {
        $rootScope.settings["DESKTOP_NOTIFICATIONS"] = $rootScope.settings["desktopNotifications"];
        delete $rootScope.settings["desktopNotifications"];
    }

    if ($rootScope.settings["soundNotifications"])
    {
        $rootScope.settings["SOUND_NOTIFICATIONS"] = $rootScope.settings["soundNotifications"];
        delete $rootScope.settings["soundNotifications"];
    }

    settingsFactory.save($rootScope.settings);

    return settingsFactory;
}]);
