Services.factory("Settings",
["$cookies", "$timeout", "$filter", "$rootScope",
function ($cookies, $timeout, $filter, $rootScope)
{
    var settingsFactory = {
        save: function ()
        {
            $cookies.settings = $filter("json")($rootScope.settings);
        }
    };

    $rootScope.settings = $.parseJSON($cookies.settings || "{}");

    $rootScope.$watch(function ($scope)
    {
        settingsFactory.save();
    });

    return settingsFactory;
}]);
