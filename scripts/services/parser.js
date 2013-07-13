Coldstorm.factory("Parser", ["$rootScope", "Connection", "Channel", "User",
    function($rootScope, Connection, Channel, User)
{
    var messages = [];

    function Message(check, process)
    {
        message = new Object();
        message.check = check;
        message.process = process;

        return message;
    }

    function registerMessage(message)
    {
        messages.push(message);
    }

    function clean(parts)
    {
        for (var i = 0; i < parts.length; i++)
        {
            if (parts[i][0] === ":")
            {
                parts[i] = parts[i].substring(1);
            }
        }

        return parts;
    }

    function getChannel(parts)
    {
        return Channel.get(parts[2]);
    }

    function getUser(parts)
    {
        var regexp = /^([a-z0-9_\-\[\]\\^{}|`]+)!([a-z0-9_\-\~]+)\@([a-z0-9\.\-]+)/i;
        var matches = parts[0].match(regexp);

        if (matches !== null)
        {
            return User.get(matches[1]);
        }

        return null;
    }

    var welcomeHandlers = [];

    var welcomeMessage = new Message(function(parts)
    {
        return parts[1] === "001";
    }, function(parts)
    {
        for (var i = 0; i < welcomeHandlers.length; i++)
        {
            welcomeHandlers[i]();
        }
    });
    registerMessage(welcomeMessage);

    Connection.onWelcome = function(handler)
    {
        welcomeHandlers.push(handler);
    };

    var noticeMessage = new Message(function(parts)
    {
        return parts[1] === "NOTICE";
    }, function(parts)
    {
        return;
    });
    registerMessage(noticeMessage);

    var motdMessage = new Message(function(parts)
    {
        return parts[1] === "372";
    }, function(parts)
    {
        return;
    });
    registerMessage(motdMessage);

    var pingMessage = new Message(function(parts)
    {
        return parts[0] === "PING";
    }, function(parts)
    {
        Connection.send("PONG " + parts[1]);
    });
    registerMessage(pingMessage);

    var privMessage = new Message(function(parts)
    {
        return parts[1] === "PRIVMSG" && getChannel(parts) !== null;
    }, function(parts)
    {
        var channel = getChannel(parts);
        var user = getUser(parts);
        var line = parts.slice(3).join(" ");

        $rootScope.$broadcast("channel.message", {
            channel: channel,
            user: user,
            line: line
        });
    });
    registerMessage(privMessage);

    var namesMessage = new Message(function(parts)
    {
        return parts[1] === "353";
    }, function(parts)
    {
        var channel = Channel.get(parts[4]);
        parts = parts.slice(5).filter(function(n)
        {
            return n;
        });

       for (var i = 0; i < parts.length; i++)
       {
            if (["+","%","@"].indexOf(parts[i][0]) != -1)
            {
                var user = User.register(parts[i].substring(1), null, null, parts[i][0]);
            } else {
                var user = User.register(parts[i], null, null, null);
            }
            channel.addUser(user);
       }

       Connection.send("WHO " + channel.name);
    });
    registerMessage(namesMessage);

    var whoMessage = new Message(function(parts)
    {
        return parts[1] === "352";
    }, function(parts)
    {
        parts = parts.slice(3).filter(function(n){return n});
        var user = User.get(parts[4]);
        var username = parts[1];
        var ranks = parts[5].substring(1);

        if (ranks != null && ranks != "" && ranks != "*")
        {
            $rootScope.$apply(function(){user.rank = ranks[ranks.length-1]});
        }

        var colorflag_regexp = /^([0-9a-f]{3}|[0-9a-f]{6})([a-z]{2})$/i;
        var matches = username.match(colorflag_regexp);

        if (matches != null)
        {
            $rootScope.$apply(function()
            {
                user.color = "#" + matches[1];
                user.flag = matches[2];
            });
        }
    });
    registerMessage(whoMessage);
    
    var joinMessage = new Message(function(parts)
    {
        return parts[1] === "JOIN";
    }, function(parts)
    {
        var user = getUser(parts);
        var channel = Channel.get(parts[2]);
        
        if (user.nickName === User.get("~").nickName)
        {
            $rootScope.$broadcast("channel.joined", channel);
        } else {
            channel.addLine(user.nickName + " joined the room.");
        }
    });
    registerMessage(joinMessage);
    
    var partMessage = new Message(function(parts)
    {
        return parts[1] === "PART";
    }, function(parts)
    {
        var user = getUser(parts);
        var channel = Channel.get(parts[2]);
        var reason = parts.slice(3).join(" ");
        
        if (user.nickName !== User.get("~").nickName)
        {
            if (reason == null)
            {
                channel.addLine(user.nickName + " left the room.");
            } else {
                channel.addLine(user.nickName + " left the room (" + reason + ").");
            }
            //remove the user from the channel
        }
    });
    registerMessage(partMessage);

    $rootScope.$on("channel.join", function(evt, channel)
    {
        Connection.send("JOIN " + channel.name);
    });

    $rootScope.$on("channel.close", function(evt, channel)
    {
        Connection.send("PART " + channel.name);
    });

    return {
        parse: function(line)
        {
            console.log("< " + line);

            var parts = clean(line.split(" "));

            for (var mIndex = 0; mIndex < messages.length; mIndex++)
            {
                var message = messages[mIndex];

                if (message.check(parts))
                {
                    message.process(parts);
                }
            }
        },

        addMessage: registerMessage
    };
}]);
