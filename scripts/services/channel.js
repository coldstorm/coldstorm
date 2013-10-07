Services.factory("Channel", ["$rootScope", "User", "Notifications", function ($rootScope, User, Notifications)
{
    var registry = {};

    $rootScope.$on("channel.joined", function (evt, channel)
    {
        channel.addLine("You joined the room.");
    });

    $rootScope.$on("channel.message", function (evt, message)
    {
        channel = message.channel;
        line = message.line;
        user = message.user;

        channel.addLine(line, user);

        var myUser = User.get("~");
        var re = new RegExp("\\b(" + myUser.nickName + ")\\b", "ig");
        var matches = message.line.match(re);

        if ($rootScope.blurred)
        {
            $rootScope.$broadcast("unread", message);
            if (matches != null)
            {
                $rootScope.$broadcast("highlighted", message);
            }
        }
    });

    channels = {
        register: function (name)
        {
            name = name.replace("%23", "#");

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

                    if ($rootScope.$$phase != "$apply" &&
                        $rootScope.$$phase != "$digest")
                    {
                        $rootScope.$apply(function ()
                        {
                            channel.lines.push(line);
                        });
                    } else
                    {
                        channel.lines.push(line);
                    }

                    return this;
                },
                addUser: function (user)
                {
                    this.users.push(user);

                    return this;
                },
                active: false,
                join: function ()
                {
                    $rootScope.$broadcast("channel.join", this);
                },
                leave: function ()
                {
                    $rootScope.$broadcast("channel.close", this);

                    delete registry[this.name];
                },
                clear: function ()
                {
                    this.lines.length = 0;
                },
                lines: [],
                name: name,
                topic: "",
                topicauthor: {},
                topicdate: "",
                users: []
            };

            return registry[name];
        },

        all: function ()
        {
            var channels = [];

            for (channel in registry)
            {
                channels.push(registry[channel]);
            }

            return channels;
        },

        get: function (name)
        {
            return registry[name];
        }
    };

    return channels;
}]);
