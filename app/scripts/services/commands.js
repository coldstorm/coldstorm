Services.factory("Commands", ["$filter", "Connection", "User", function ($filter, Connection, User)
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
    var kickCommand = new Command("KICK", [], 1, kickCallback, "/KICK <target> [reason]",
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
    var unbanCommand = new Command("UNBAN", [], 1, unbanCallback, "/UNBAN <mask>",
        "Removes the given mask from the current channel's banlist.");
    registerCommand(unbanCommand);

    var banlistCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            if (args.length < 1)
            {
                Connection.send("MODE " + target.name + " b");
            } else
            {
                Connection.send("MODE " + args[0] + " b");
            }
        }
    };
    var banlistCommand = new Command("BANLIST", [], 0, banlistCallback, "/BANLIST [channel]",
        "Retrieves the banlist of the current or given channel.");
    registerCommand(banlistCommand);

    var topicCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            Connection.send("TOPIC " + target.name + " :" + args.join(" "));
        }
    }
    var topicCommand = new Command("TOPIC", ["MOTD"], 1, topicCallback, "/TOPIC <topic>",
        "Sets the topic of the current channel.");
    registerCommand(topicCommand);

    // Ranks
    var voiceCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var nick = args[0];

            Connection.send("MODE " + channel.name + " +v " + nick);
        }
    };
    var voiceCommand = new Command("VOICE", ["+V"], 1, voiceCallback, "/VOICE <user>",
        "Gives voice to the given user.");
    registerCommand(voiceCommand);

    var devoiceCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var nick = args[0];

            Connection.send("MODE " + channel.name + " -v " + nick);
        }
    };
    var devoiceCommand = new Command("DEVOICE", ["-V"], 1, devoiceCallback, "/DEVOICE <user>",
        "Removes voice from the given user.");
    registerCommand(devoiceCommand);

    var halfopCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var nick = args[0];

            Connection.send("MODE " + channel.name + " +h " + nick);
        }
    };
    var halfopCommand = new Command("HALFOP", ["+H"], 1, halfopCallback, "/HALFOP <user>",
        "Gives halfop to the given user.");
    registerCommand(halfopCommand);

    var dehalfopCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var nick = args[0];

            Connection.send("MODE " + channel.name + " -h " + nick);
        }
    };
    var dehalfopCommand = new Command("DEHALFOP", ["-H"], 1, dehalfopCallback, "/DEHALFOP <user>",
        "Removes halfop from the given user.");
    registerCommand(dehalfopCommand);

    var opCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var nick = args[0];

            Connection.send("MODE " + channel.name + " +o " + nick);
        }
    };
    var opCommand = new Command("OP", ["+O"], 1, opCallback, "/OP <user>",
        "Gives op to the given user.");
    registerCommand(opCommand);

    var deopCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var nick = args[0];

            Connection.send("MODE " + channel.name + " -o " + nick);
        }
    };
    var deopCommand = new Command("DEOP", ["-O"], 1, deopCallback, "/DEOP <user>",
        "Removes op from the given user.");
    registerCommand(deopCommand);

    var stripCallback = function (cmd, args, target)
    {
        if (target.name)
        {
            var channel = target;
            var nick = args[0];

            Connection.send("MODE " + channel.name + " -vho " + nick + " " + nick + " " + nick);
        }
    };
    var stripCommand = new Command("STRIP", [], 1, stripCallback, "/STRIP <user>",
        "Strips the user of all his ranks.");
    registerCommand(stripCommand);

    // UI
    var clearCallback = function (cmd, args, target)
    {
        target.clear();
    };
    var clearCommand = new Command("CLEAR", [], 0, clearCallback, "/CLEAR",
        "Clears the lines from the current tab.");
    registerCommand(clearCommand);

    // MISC
    var msgCallback = function (cmd, args, target)
    {
        Connection.send("PRIVMSG " + args[0] + " :" + args.slice(1).join(" "));
    }
    var msgCommand = new Command("MSG", ["QUERY"], 2, msgCallback, "/MSG <target> <message>",
        "Sends a private message to the target.");
    registerCommand(msgCommand);

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

    var afkCallback = function (cmd, args, target)
    {
        var awayMsg;
        if (args.length > 0)
        {
            Connection.send("AWAY :" + args[0]);
            awayMsg = args[0];
        } else
        {
            Connection.send("AWAY :afk");
            awayMsg = "afk";
        }

        User.get("~").awayMsg = $filter("truncate")(awayMsg, 7);
    };
    var afkCommand = new Command("AFK", ["AWAY"], 0, afkCallback, "/AFK [message]",
        "Marks you as afk.");
    registerCommand(afkCommand);

    var backCallback = function (cmd, args, target)
    {
        Connection.send("AWAY");
        User.get("~").awayMsg = null;
    };
    var backCommand = new Command("BACK", [], 0, backCallback, "/BACK", 
        "Unmarks you as afk.");
    registerCommand(backCommand);

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

            Connection.send(line);
        }
    };
}]);