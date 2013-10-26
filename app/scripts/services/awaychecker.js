Services.factory("AwayChecker", ["$timeout", "Connection", function ($timeout, Connection)
{
    var channels = [];

    var check = function ()
    {
        $timeout(function ()
        {
            for (var i = 0; i < channels.length; i++)
            {
                Connection.send("WHO " + channels[i]);
            }
            check();
        }, 30000)
    }

    return {
        register: function (channel)
        {
            channels.push(channel.name);
        },

        unregister: function (channel)
        {
            channels.splice(channels.indexOf(channel.name), 1);
        },

        start: function ()
        {
            check();
        }
    }
}]);