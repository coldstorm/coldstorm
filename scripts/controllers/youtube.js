﻿Controllers.controller("YouTubeCtrl", ["$scope", "$routeParams", "$location", "YouTube", "Query", "Channel",
    function ($scope, $routeParams, $location, YouTube, Query, Channel)
    {
        var id = $routeParams.id;

        $scope.youtube = YouTube.get(id);

        $scope.$on("youtube.close", function (evt, youtube)
        {
            if (youtube == $scope.youtube)
            {
                var channels = $scope.channels;

                if (channels.length > 1)
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