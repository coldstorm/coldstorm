Controllers.controller("ChannelCtrl",
    ["$scope", "$routeParams", "$location", "User", "Channel", "Query",
    "Connection",
    function ($scope, $routeParams, $location, User, Channel, Query,
    Connection)
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

        $scope.send = function ()
        {
            var line = $scope.input.text;

            if (line.length < 1)
            {
                return;
            }

            // Clear the line

            $scope.input.text = "";

            if (line[0] === "/")
            {
                Connection.send(line.substring(1))

                return;
            }
            
            $scope.channel.addLine(line, $scope.user);

            Connection.send("PRIVMSG " + $scope.channel.name + " " + line);
        };

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
    }]);
