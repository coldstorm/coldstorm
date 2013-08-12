Services.factory("Channel", function ($rootScope)
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

        if ($rootScope.blurred)
        {
            $rootScope.unread++;
            document.title = "Coldstorm" + " | " + message.channel.name + " (" + $rootScope.unread + ")";
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
});
