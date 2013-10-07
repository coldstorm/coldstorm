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

        var myUser = User.get("~");
        var re = new RegExp("\\b(" + myUser.nickName + ")\\b", "ig");
        var matches = message.line.match(re);

        if ($rootScope.blurred)
        {
            $rootScope.$broadcast("unread_pm", message);
            if (matches != null)
            {
                $rootScope.$broadcast("highlighted_pm", message);
            }
        }
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
                active: false,
                close: function ()
                {
                    $rootScope.$broadcast("query.close", this);

                    delete registry[this.name];
                },
                clear: function ()
                {
                    this.lines.length = 0;
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
