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
                close: function ()
                {
                    delete registry[this.name];
                },
                lines: [],
                name: name,
                user: User.get(name)
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

            return queries;
        },

        get: function (name)
        {
            return registry[name];
        }
    };

    return queries;
}]);
