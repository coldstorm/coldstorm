Services.factory("Query", function ($rootScope)
{
    var registry = {};

    $rootScope.$on("query.message", function (evt, message)
    {
        query = message.query;
        line = message.line;
        user = message.user;

        query.addLine(line, user);
    });

    var queries = {
        register: function (name)
        {
            registry[name] = {
                addLine: function (message, author)
                {
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
                    var channel = this;

                    if ($rootScope.$$phase == "$scope" ||
                        $rootScope.$$phase == "$digest")
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
                active: false,
                leave: function ()
                {
                    delete registry[this.name];
                },
                lines: [],
                name: name,
            };

            return registry[name];
        },

        all: function ()
        {
            var queries = [];

            for (query in registry)
            {
                queries.push(registry[query]);
            }

            return channels;
        },

        get: function (name)
        {
            return registry[name];
        }
    };

    return queries;
});
