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

    function checkCommand(input, target, command)
    {
        var parts = input.split(" ");

        if ((parts[0] === command.name ||
            command.aliases.indexOf(parts[0]) > -1) &&
            parts.slice(1).length >= command.args)
        {
            command.callback(parts[0], parts.slice(1), target);
            return true;
        }

        return false;
    }
    
    function registerCommand(command)
    {
        commands.push(command);
    }

    // Channel management
    var kickCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var nickname = args[0];
            var reason = args.slice(1).join(" ");
            if (reason)
            {
                Connection.send("KICK " + channel.name + " " + nickname + " :" + reason);
            } else
            {
                Connection.send("KICK " + channel.name + " " + nickname);
            }
        }
    };
    var kickCommand = new Command("KICK", ["K"], 1, kickCallback, "/KICK <target> [reason]");
    registerCommand(kickCommand);

    var banCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var mask = args[0];

            Connection.send("MODE " + channel.name + " +b " + mask);
        }
    };
    var banCommand = new Command("BAN", [], 1, banCallback, "/BAN <mask>");
    registerCommand(banCommand);

    // Ranks

    // UI
    var clearCallback = function (cmd, args, target)
    {
        target.clear();
    };
    var clearCommand = new Command("CLEAR", [], 0, clearCallback, "/CLEAR");
    registerCommand(clearCommand);

    // MISC
    var actionCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var line = args.join(" ");

            Connection.send("PRIVMSG " + channel.name + " \u0001ACTION " + line + "\u0001");
            target.addLine("\u0001ACTION " + line + "\u0001", User.get("~"));
        }
    };
    var actionCommand = new Command("ACTION", ["ME"], 1, actionCallback, "/ACTION <action");
    registerCommand(actionCommand);

    return {
        parse: function (line, target)
        {
            line = line.substring(1);
            for (var i = 0; i < commands.length; i++)
            {
                if (checkCommand(line, target, commands[i]))
                {
                    return;
                }
            }

            Connection.send(line.substring(1));
        }
    };
}]);