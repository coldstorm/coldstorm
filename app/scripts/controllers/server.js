Controllers.controller("ServerCtrl",
    ["$scope", "$location", "User", "Channel", "Query", "YouTube", "Server",
    "Connection", "Input",
    function ($scope, $location, User, Channel, Query, YouTube, Server,
    Connection, Input)
    {
        $scope.user = User.get("~");

        $scope.server = Server.get("Server");
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
