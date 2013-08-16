Services.factory("Settings", ["$cookies", "$timeout", "$filter", "$rootScope", function ($cookies, $timeout, $filter, $rootScope)
{
    $rootScope.settings = $cookies.settings;

    if ($rootScope.settings)
    {
        $rootScope.settings = $.parseJSON($rootScope.settings);
    } else {
        $rootScope.settings = {};
    }

    return {
        get: function (name)
        {
            if ($rootScope.settings.hasOwnProperty(name) > -1)
            {
                return $rootScope.settings[name];
            } else
            {
                return null;
            }
        },

        set: function (name, value)
        {
            $rootScope.settings = $cookies.settings;
            if ($rootScope.settings)
            {
                $rootScope.settings = $.parseJSON($rootScope.settings);
            } else
            {
                $rootScope.settings = {};
            }

            $rootScope.settings[name] = value;
            $cookies.settings = $filter("json")($rootScope.settings);
        }
    }
}]);