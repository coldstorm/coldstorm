Services.factory("Settings",
["$timeout", "$filter", "$rootScope",
function ($timeout, $filter, $rootScope)
{
    var settingsFactory = {
        save: function ()
        {
            $.cookie("settings", $filter("json")($rootScope.settings), { expires: new Date(2017, 00, 01) });
        }
    };

    $rootScope.settings = $.parseJSON($.cookie("settings") || "{}");

    $rootScope.$watch(function ($scope)
    {
        settingsFactory.save();
    });

    return settingsFactory;
}]);
