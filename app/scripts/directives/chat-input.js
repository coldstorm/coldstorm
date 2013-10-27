Directives.directive("chatInput", function ()
{
    return {
        controller: "ChatInputCtrl",
        replace: true,
        restrict: "E",
        scope: { input: "=input", tab: "=tab" },
        templateUrl: "app/views/chat-input.html",
        transclude: true
    }
});