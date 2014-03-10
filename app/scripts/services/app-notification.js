Services.factory("AppNotification",
["$rootScope", "$http", "$timeout",
function ($rootScope, $http, $timeout)
{
    $rootScope.appNotification = "";

    var timeout = 60 * 1000;

    var fetchUpdate = function ()
    {
        $timeout(function ()
        {
            $http.jsonp("https://api.github.com/repos/coldstorm/coldstorm/events?callback=JSON_CALLBACK")
            .success(function (data, status, headers)
            {
                if (status == 200)
                {
                    var events = data["data"];
                    var commit;

                    for (var i = 0; i < events.length; i++) 
                    {
                        if (events[i].type == "PushEvent" && events[i].payload.ref == "refs/heads/gh-pages")
                        {
                            commit = events[i].payload.commits[events[i].payload.commits.length - 1]; // Take the last commit in a bunch as it's the newest one
                            break;
                        }
                    };

                    if (commit)
                    {
                        if (commit.sha != $rootScope.meta.version && $rootScope.meta.version != "local")
                        {
                            $rootScope.appNotification = "Reload the page to get the newest version of Coldstorm!";
                        }
                    }
                }
            })
            .error(function (data, status, headers)
            {
                
            });

            fetchUpdate();
        }, timeout)
    };

    fetchUpdate();

    return {
        dismiss: function ()
        {
            $rootScope.appNotification = "";
        }
    };
}]);