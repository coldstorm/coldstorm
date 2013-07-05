Coldstorm.controller("LoginCtrl",
    ["$scope", "$rootScope", "$location", "$timeout", "Connection", "User", "Channel",
    function($scope, $rootScope, $location, $timeout, Connection, User, Channel)
{
    $scope.user = User.get("~");
    
    $scope.login = function()
    {
        Connection.connect("ws://coldstorm.tk:81");
        
        Connection.onOpen(function()
        {
            console.log("Opened");
        });
        
        Connection.onMessage(function(message)
        {
            console.log("Message received:", message);
        });
        
        Connection.onClose(function()
        {
            console.log("Closed");
        });
        
        var cs = Channel.register("#Coldstorm")
            .addLine("Testing line colors", $scope.user)
            .addUser($scope.user);
        var two = Channel.register("#2");
        
        $timeout(function()
        {
            // Fire the messages after a second so the directive loads
            
            $rootScope.$broadcast("channel.message", { channel: cs });
            $rootScope.$broadcast("channel.message", { channel: two });
        }, 1000);
        
        $location.path("/channels/#Coldstorm");
    };
}]);
