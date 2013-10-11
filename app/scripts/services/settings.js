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

    return settingsFactory;
}]);
