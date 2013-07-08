Coldstorm.controller("LoginCtrl",
    ["$scope", "$rootScope", "$location", "$timeout", "Connection", "User", "Channel", "Parser",
    function($scope, $rootScope, $location, $timeout, Connection, User, Channel, Parser)
{
    $scope.user = User.get("~");
    
    $scope.login = function()
    {
        Connection.connect("ws://coldstorm.tk:81");
        
        Connection.onOpen(function()
        {
            Connection.send("NICK " + $scope.user.nickName);
            Connection.send("USER " + $scope.user.color.substring(1).toUpperCase() + $scope.user.flag + " - - :New coldstormer");
        });
        
        Connection.onMessage(function(message)
        {
            Parser.parse(message);
        });
        
        Connection.onClose(function()
        {
            console.log("Closed");
        });
        
        var cs = Channel.register("#Coldstorm");
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
