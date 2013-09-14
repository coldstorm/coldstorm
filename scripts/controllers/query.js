Controllers.controller("QueryCtrl",
    ["$scope", "$rootScope", "$routeParams", "$location", "User", "Channel", "Query", "YouTube",
    "Connection", "Input", 
    function ($scope, $rootScope, $routeParams, $location, User, Channel, Query, YouTube,
    Connection, Input)
    {
        $scope.user = User.get("~");

        if ($scope.user.nickName === "")
        {
            $location.path("/login");
            return;
        }

        var nickName = $routeParams.nickName

        $scope.query = Query.get(nickName) || Query.register(nickName);

        $scope.$watch("query.active", function ()
        {
            $scope.query.active = false;
        });

        $scope.$on("query.close", function (evt, query)
        {
            if (query == $scope.query)
            {
                var channels = $scope.channels;

                if (channels.length >= 1)
                {
                    $location.path("/channels/" + channels[0].name);
                }
            }
        });

        $scope.$watch(function ()
        {
            $scope.queries = Query.all();
        });

        $scope.$watch(function ()
        {
            $scope.channels = Channel.all();
        });

        $scope.$watch(function ()
        {
            $scope.youtubes = YouTube.all();
        });
    }]);
