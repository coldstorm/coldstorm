Coldstorm.factory("Channel", function($rootScope)
{
    var registry = { };

    $rootScope.$on("channel.joined", function(evt, channel)
    {
        channel.addLine("You joined the room.");
    });

    $rootScope.$on("channel.message", function(evt, message)
    {
        channel = message.channel;
        line = message.line;
        user = message.user;

        $rootScope.$apply(function()
        {
            channel.addLine(line, user);
        });
    });

    channels = {
        register: function(name)
        {
            name = name.replace("%23", "#");

            registry[name] = {
                addLine: function(message, author)
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

                    this.lines.push(line);

                    return this;
                },
                addUser: function(user)
                {
                    this.users.push(user);

                    this.users = this.users.sort(function(a, b)
                    {
                        var ranks = ["", "+", "%", "@"];

                        if (a.rank != b.rank)
                        {
                            if (ranks.indexOf(a.rank) > ranks.indexOf(b.rank))
                            {
                                return -1;
                            }

                            return 1;
                        }

                        return a.nickName.localeCompare(b.nickName);
                    });

                    return this;
                },
                active: false,
                join: function()
                {
                    $rootScope.$broadcast("channel.joined", this);
                },
                leave: function()
                {
                    $rootScope.$broadcast("channel.close", this);

                    delete registry[name];
                },
                lines: [],
                name: name,
                topic: "Temporary topic",
                users: []
            };

            return registry[name];
        },

        all: function()
        {
            var channels = [];

            for (channel in registry)
            {
                channels.push(registry[channel]);
            }

            return channels;
        },

        get: function(name)
        {
            return registry[name];
        }
    };

    return channels;
});
