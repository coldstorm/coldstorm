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
    $rootScope.settings["DESKTOP_NOTIFICATIONS"] = $rootScope.settings["desktopNotifications"];
    $rootScope.settings["SOUND_NOTIFICATIONS"] = $rootScope.settings["soundNotifications"];

    delete $rootScope.settings["desktopNotifications"];
    delete $rootScope.settings["soundNotifications"];

    settingsFactory.save($rootScope.settings);

    return settingsFactory;
}]);
