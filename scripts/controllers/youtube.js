Controllers.controller("YouTubeCtrl", ["$rootScope", "$scope", "$routeParams", "$location", "User", "YouTube", "Query", "Channel",
    function ($rootScope, $scope, $routeParams, $location, User, YouTube, Query, Channel)
    {
        $scope.user = User.get("~");

        if ($scope.user.nickName === "")
        {
            $location.path("/login");
            return;
        }

        var id = $routeParams.id;

        $scope.youtube = YouTube.get(id);

        if ($scope.youtube === undefined)
        {
            $scope.youtube = YouTube.register(id);
        }

        $rootScope.$on("youtube.close", function (evt, youtube)
        {
            if (youtube.id === $scope.youtube.id)
            {
                var channels = $scope.channels;

                if (channels.length >= 1)
                {
                    $location.path("/channels/" + channels[0].name)
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