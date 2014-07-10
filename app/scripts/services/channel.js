Services.factory("Channel", ["$rootScope", "User", "Notifications", function ($rootScope, User, Notifications)
{
    var registry = {};

    $rootScope.$on("channel.joined", function (evt, channel)
    {
        channel.addLine("You joined the room.");
        channel.connected = true;
    });

    $rootScope.$on("channel.message", function (evt, message)
    {
        channel = message.channel;
        line = message.line;
        user = message.user;

        channel.addLine(line, user);

        var client = User.get("~");
        var re = new RegExp("\\b(" + client.nickName + ")\\b", "ig");
        var matches = message.line.match(re);

        if ($rootScope.blurred)
        {
            $rootScope.$broadcast("unread", message);
            if (matches !== null)
            {
                $rootScope.$broadcast("highlighted", message);
            }
        }
    });

    channels = {
        register: function (name)
        {
            name = name.replace("%23", "#");

            // Check for duplicates
            for (var channel in registry)
            {
                if (registry[channel].name.toLowerCase() === name.toLowerCase()) return registry[channel];
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
                join: function ()
                {
                    $rootScope.$broadcast("channel.join", this);
                },
                close: function (reason)
                {
                    if (this.connected)
                    {
                        // The user is connected to this tab, don't close it
                        $rootScope.$broadcast("channel.part", { channel: this, reason: reason });
                        this.connected = false;
                        this.users.length = 0;
                        this.topic = "";
                        this.topicauthor = {};
                        this.topicdate = "";
                    }

                    else
                    {
                        // Remove the channel from the user's list
                        var client = User.get("~");
                        client.removeChannel(this.name);
                        // The user isn't connected so we can close it
                        delete registry[this.name];
                    }
                },
                clear: function ()
                {
                    this.lines.length = 0;
                },
                active: false,
                connected: false,
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

            for (var channel in registry)
            {
                channels.push(registry[channel]);
            }

            return channels;
        },

        get: function (name)
        {
            for (var channel in registry)
            {
                if (registry[channel].name.toLowerCase() === name.toLowerCase()) return registry[channel];
            }
            return null;
        },

        set: function (oldname, newname)
        {
            if (registry[oldname] && oldname !== newname)
            {
                registry[newname] = registry[oldname];
                registry[newname].name = newname;
                delete registry[oldname];
            }
        }
    };

    return channels;
}]);
