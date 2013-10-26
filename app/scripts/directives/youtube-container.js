Directives.directive("youtubeContainer", [function ()
{
    return {
        controller: "YouTubeContainerCtrl",
        replace: true,
        restrict: "E",
        scope: { youtube: "=youtube" },
        templateUrl: "views/youtube-container.html",
        transclude: true
    };
}]);