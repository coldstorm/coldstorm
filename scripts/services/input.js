Services.factory("Input", ["$rootScope", "Connection", "User",  function ($rootScope, Connection, User)
{
    $rootScope.process = function (input, target)
    {
        var line = input.text;

        //Clear the input
        input.text = "";

        if (line.length < 1)
        {
            return;
        }

        //Parse commands
        if (line[0] === "/")
        {
            Connection.send(line.substring(1));
            return;
        }

        //Parse formatting

        //Send the line
        if (target.name) //it's a channel
        {
            Connection.send("PRIVMSG " + target.name + " :" + line);
        } else if (target.user) //it's a query
        {
            Connection.send("PRIVMSG " + target.user.nickName + " :" + line);
        }

        //Add the line to the current tab
        target.addLine(line, User.get("~"));
    }
}]);