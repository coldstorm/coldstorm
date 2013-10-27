Controllers.controller("ChannelCtrl",
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

        var channelName = $routeParams.channelName

        // Handle hashes in the URI representing the start of channel names

        if (!channelName)
        {
            channelName = "#" + $location.hash();
        }

        if ($location.hash())
        {
            $location.path("/channels/" + channelName);
            $location.hash("");

            return;
        }

        $scope.channel = Channel.get(channelName);

        $scope.$watch("channel.active", function ()
        {
            $scope.channel.active = false;
        });

        $scope.$on("channel.close", function (evt, channel)
        {
            if (channel == $scope.channel)
            {
                var channels = $scope.channels;

                if (channels.length > 1)
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
