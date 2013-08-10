Controllers.controller("QueryCtrl",
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

        var nickName = $routeParams.nickName

        $scope.query = Query.get(nickName) || Query.register(nickName);

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

            Connection.send("PRIVMSG " + $scope.query.user.nickName + " " +
                            line);
        };

        $scope.$watch("query.active", function ()
        {
            $scope.query.active = false;
        });

        $scope.$on("query.close", function (evt, query)
        {
            if (query == $scope.query)
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
            $scope.channels = Channel.all();
        });
    }]);
