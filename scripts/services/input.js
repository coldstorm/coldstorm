Services.factory("Input", ["$rootScope", "Connection", "User",  function ($rootScope, Connection, User)
{
    $rootScope.process = function (input, target)
    {
        var line = input.text;
        //Parse commands

        //Parse formatting

        //Send the line
        if (target.name) //it's a channel
        {
            Connection.send("PRIVMSG " + target.name + " :" + line);
        } else if (target.user) //it's a query
        {
            Connection.send("PRIVMSG " + target.user.nickName + " :" + line);
        }

        //Clear the input
        input.text = "";

        //Add the line to the current tab
        target.addLine(line, User.get("~"));
    }
}]);