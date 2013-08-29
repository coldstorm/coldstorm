Services.factory("Commands", ["Connection", "User", function (Connection, User)
{
    var commands = [];

    function Command(name, aliases, args, callback, help)
    {
        command = new Object();
        command.name = name;
        command.aliases = aliases;
        command.args = args;
        command.callback = callback;
        command.help = help;

        return command;
    }

    function checkCommand(input, command)
    {
        var parts = input.split(" ");

        if ((parts[0] === command.name ||
            command.aliases.indexOf(parts[0]) > -1) &&
            parts.slice(1).length >= command.args)
        {
            command.callback(parts[0], parts.slice(1));
            return true;
        }

        return false;
    }
    
    function registerCommand(command)
    {
        commands.push(command);
    }

    // Channel management
    var kickHandler = new cmdHandler(function (cmd)
    {
        return cmd.name === "KICK" && cmd.args.length >= 1;
    }, function (cmd, target)
    {
        if (target.name)
        {
            var channel = target;
            var nickname = cmd.args[0];
            var reason = cmd.args.slice(1).join(" ");
            if (reason)
            {
                Connection.send("KICK " + channel.name + " " + nickname + " :" + reason);
            } else
            {
                Connection.send("KICK " + channel.name + " " + nickname);
            }
        }
    });
    registerHandler(kickHandler);

    var banHandler = new cmdHandler(function (cmd)
    {
        return cmd.name === "BAN" && cmd.args.length >= 1;
    }, function (cmd, target)
    {
        if (target.name)
        {
            var channel = target;
            var mask = cmd.args[0];

            Connection.send("MODE " + channel.name + " +b " + mask);
        }
    });
    registerHandler(banHandler);

    // Ranks

    // UI
    var clearHandler = new cmdHandler(function (cmd)
    {
        return cmd.name === "CLEAR";
    }, function (cmd, target)
    {
        target.clear();
    });
    registerHandler(clearHandler);

    // MISC
    var actionHandler = new cmdHandler(function (cmd)
    {
        return cmd.name === "ME";
    }, function (cmd, target)
    {
        if (target.name)
        {
            var channel = target;
            var line = cmd.args.join(" ");

            Connection.send("PRIVMSG " + channel.name + " \u0001ACTION " + line + "\u0001");
            target.addLine("\u0001ACTION " + line + "\u0001", User.get("~"));
        }
    });
    registerHandler(actionHandler);

    return {
        parse: function (line, target)
        {
            for (var i = 0; i < commands.length; i++)
            {
                if (checkCommand(line, commands[i]))
                {
                    return;
                }
            }

            Connection.send(line.substring(1));
        }
    };
}]);