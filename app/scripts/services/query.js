Services.factory("Query",
["$rootScope", "User",
function ($rootScope, User)
{
    var registry = {};

    $rootScope.$on("query.message", function (evt, message)
    {
        query = message.query;
        line = message.line;
        user = message.user;

        query.addLine(line, user);

        var client = User.get("~");
        var re = new RegExp("\\b(" + client.nickName + ")\\b", "ig");
        var matches = message.line.match(re);

        if ($rootScope.blurred)
        {
            $rootScope.$broadcast("unread_pm", message);
            if (matches !== null)
            {
                $rootScope.$broadcast("highlighted_pm", message);
            }
        }
    });

    var queries = {
        register: function (name)
        {
            // Check for duplicates
            for (var query in registry)
            {
                if (registry[query].name.toLowerCase() === name.toLowerCase()) return registry[query];
            }

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
                    var query = this;

                    if ($rootScope.$$phase != "$apply" &&
                        $rootScope.$$phase != "$digest")
                    {
                        $rootScope.$apply(function ()
                        {
                            query.lines.push(line);
                        });
                    } else
                    {
                        query.lines.push(line);
                    }

                    return this;
                },
                close: function ()
                {
                    $rootScope.$broadcast("query.close", this);

                    delete registry[this.name];
                },
                clear: function ()
                {
                    this.lines.length = 0;
                },
                active: false,
                lines: [],
                name: name,
                user: User.get(name)
            };

            return registry[name];
        },

        all: function ()
        {
            var queries = [];

            for (var query in registry)
            {
                queries.push(registry[query]);
            }

            return queries;
        },

        get: function (name)
        { 
            for (var query in registry)
            {
                if (registry[query].name.toLowerCase() === name.toLowerCase()) return registry[query];
            }
            return null;
        }
    };

    return queries;
}]);
