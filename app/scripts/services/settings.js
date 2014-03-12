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

    // FADE_NOTIFICATIONS_TIME must have a value
    if ($rootScope.settings["FADE_NOTIFICATIONS_TIME"] == null)
    {
        $rootScope.settings["FADE_NOTIFICATIONS_TIME"] = 1;
    }
    
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
