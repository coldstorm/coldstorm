Controllers.controller("ServerCtrl",
    ["$scope", "$location", "User", "Channel", "Query", "YouTube", "Server",
    "Connection",
    function ($scope, $location, User, Channel, Query, YouTube, Server,
    Connection)
    {
        $scope.user = User.get("~");

        $scope.server = Server;
        console.log(Server);
        if ($scope.user.nickName === "")
        {
            $location.path("/login");
            return;
        }

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
