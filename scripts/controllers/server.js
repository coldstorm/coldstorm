Controllers.controller("ServerCtrl",
    ["$scope", "$location", "User", "Channel", "Query", "Server",
    "Connection",
    function ($scope, $location, User, Channel, Query, Server,
    Connection)
    {
        $scope.user = User.get("~");

        $scope.server = Server;
        console.log(Server);
        if ($scope.user.nickName === "")
        {
            //$location.path("/login");
            //return;
        }

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
            }

            return;
        };

        $scope.$watch(function ()
        {
            $scope.queries = Query.all();
        });

        $scope.$watch(function ()
        {
            $scope.channels = Channel.all();
        });
    }]);
