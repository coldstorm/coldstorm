Services.factory("Commands", ["Connection", "User", function (Connection, User)
{
    var commands = [];

    function Command(name, aliases, args, callback, usage, description)
    {
        command = new Object();
        command.name = name;
        command.aliases = aliases;
        command.args = args;
        command.callback = callback;
        command.usage = usage;
        command.description = description;

        return command;
    }

    function checkCommand(input, target, command)
    {
        var parts = input.split(" ");
        parts[0] = parts[0].toUpperCase();

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
    
    function generateHelp(command)
    {
        if (command.aliases.length > 0)
        {
            return ("\\c32[Aliases: " + command.aliases.join(",") + "] \\b" + command.usage);
        } else
        {
            return ("\\c32\\b" + command.usage);
        }
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
    var kickCommand = new Command("KICK", ["K"], 1, kickCallback, "/KICK <target> [reason]",
        "Kicks the target from the current channel with an optional reason.");
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
    var banCommand = new Command("BAN", [], 1, banCallback, "/BAN <mask>",
        "Adds the given mask to the current channel's banlist.");
    registerCommand(banCommand);
    
    var unbanCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var mask = args[0];

            Connection.send("MODE " + channel.name + " -b " + mask);
        }
    };
    var unbanCommand = new Command("UNBAN", ["UB"], 1, unbanCallback, "/UNBAN <mask>",
        "Removes the given mask from the current channel's banlist.");
    registerCommand(unbanCommand);
    // Ranks

    // UI
    var clearCallback = function (cmd, args, target)
    {
        target.clear();
    };
    var clearCommand = new Command("CLEAR", [], 0, clearCallback, "/CLEAR",
        "Clears the lines from the current tab.");
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
    var actionCommand = new Command("ACTION", ["ME"], 1, actionCallback, "/ACTION <action>",
        "<placeholder>");
    registerCommand(actionCommand);

    var helpCallback = function (cmd, args, target)
    {
        target.addLine("\\uHelp");
        if (args.length > 0)
        {
            var matches = commands.filter(function (element)
            {
                return (element.name == args[0].toUpperCase());
            });

            if (matches.length < 1)
            {
                target.addLine("Command couldn't be found.");
            } else
            {
                for (var i = 0; i < matches.length; i++)
                {
                    var command = matches[i];
                    target.addLine(generateHelp(command));
                    target.addLine(" - " + command.description);
                }
            }

        } else
        {
            for (var i = 0; i < commands.length; i++)
            {
                var command = commands[i];
                target.addLine(generateHelp(command));
                target.addLine(" - " + command.description);
            }
        }
    };
    var helpCommand = new Command("HELP", ["?"], 0, helpCallback, "/HELP [command]",
        "Provides a list of commands or help about a given command.");
    registerCommand(helpCommand);

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