Services.factory("Server", ["Channel", function (Channel)
{
    var server = Channel.register("Server");
    server.leave();

    return server;
}]);
