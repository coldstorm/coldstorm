Services.factory("Server", ["$rootScope", function ($rootScope)
{
    var registry = {};

    server = {
        register: function (name)
        {
            registry[name] = {
                addLine: function (message, author)
                {
                    var backlog_amount;
                    if ($rootScope.settings && $rootScope.settings.BACKLOG_AMOUNT)
                    {
                        backlog_amount = $rootScope.settings.BACKLOG_AMOUNT;
                    }

                    else
                    {
                        backlog_amount = 250;
                    }

                    var splice = this.lines.length - (backlog_amount * 1.05);

                    this.lines.splice(0, splice);

                    line = {
                        author: null,
                        message: "",
                        systemMessage: false,
                        time: new Date()
                    };

                    if (author)
                    {
                        line.author = author;
                    } else
                    {
                        line.systemMessage = true;
                    }

                    line.message = message;
                    var server = this;

                    if ($rootScope.$$phase != "$apply" &&
                        $rootScope.$$phase != "$digest")
                    {
                        $rootScope.$apply(function ()
                        {
                            server.lines.push(line);
                        });
                    } else
                    {
                        server.lines.push(line);
                    }

                    return this;
                },
                clear: function ()
                {
                    this.lines.length = 0;
                },
                active: false,
                lines: [],
                name: name
            };
        },
        get: function (name)
        {
            return registry[name];
        }
    };

    return server;
}]);
