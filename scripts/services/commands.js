Services.factory("Commands", ["Connection", function (Connection)
{
    var handlers = [];

    function Command(line)
    {
        var parts = line.split(" ");

        command = new Object();
        command.name = parts[0].toUpperCase();
        command.args = parts.slice(1);

        return command;
    }

    function cmdHandler(check, process)
    {
        handler = new Object();
        handler.check = check;
        handler.process = process;

        return handler;
    }

    function registerHandler(cmdHandler)
    {
        handlers.push(cmdHandler);
    }

    // Channel management

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

    return {
        parse: function (line, target)
        {
            var command = new Command(line.substring(1));

            for (var i = 0; i < handlers.length; i++)
            {
                var handler = handlers[i];

                if (handler.check(command))
                {
                    handler.process(command, target);
                }
            }
        }
    };
}]);