Services.factory("Parser", ["$http", "$location", "$rootScope", "Connection",
    "Channel", "User", "Query",
    function ($http, $location, $rootScope, Connection, Channel, User, Query)
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

        function getQuery (parts)
        {
            return Query.get(parts[2]);
        }

        function getUser(parts)
        {
            var regexp = /^([a-z0-9_\-\[\]\\^{}|`]+)!([a-z0-9_\.\-\~]+)\@([a-z0-9\.\-]+)/i;
            var matches = parts[0].match(regexp);

            if (matches !== null)
            {
                return User.get(matches[1]);
            }

            return null;
        }

        // Checks if the message is a CTCP message and returns the CTCP command or null
        function getCTCP(parts)
        {
            if ((parts[1] === "NOTICE" || parts[1] === "PRIVMSG") && parts[3].indexOf("\001") === 0)
            {
                parts[3] = parts[3].replace("\001", "");
                return parts[3];
            }

            return null;
        }

        var welcomeHandlers = [];

        var welcomeMessage = new Message(function (parts)
        {
            return parts[1] === "001";
        }, function (parts)
        {
            for (var i = 0; i < welcomeHandlers.length; i++)
            {
                welcomeHandlers[i]();
            }
        });
        registerMessage(welcomeMessage);

        Connection.onWelcome = function (handler)
        {
            welcomeHandlers.push(handler);
        };

        var noticeMessage = new Message(function (parts)
        {
            return parts[1] === "NOTICE";
        }, function (parts)
        {
            return;
        });
        registerMessage(noticeMessage);

        var motdMessage = new Message(function (parts)
        {
            return parts[1] === "372";
        }, function (parts)
        {
            return;
        });
        registerMessage(motdMessage);

        var pingMessage = new Message(function (parts)
        {
            return parts[0] === "PING";
        }, function (parts)
        {
            Connection.send("PONG " + parts[1]);
        });
        registerMessage(pingMessage);

        var privMessage = new Message(function (parts)
        {
            return (parts[1] === "PRIVMSG" &&
                    getChannel(parts) !== null &&
                    getCTCP(parts) === null);
        }, function (parts)
        {
            var channel = getChannel(parts);
            var user = getUser(parts);
            var line = parts.slice(3).join(" ");

            if (channel !== undefined)
            {
                $rootScope.$broadcast("channel.message", {
                    channel: channel,
                    user: user,
                    line: line
                });
            } else
            {
                var query = Query.get(user.nickName) ||
                            Query.register(user.nickName);

                if (query !== undefined)
                {
                    $rootScope.$broadcast("query.message", {
                        query: query,
                        user: user,
                        line: line
                    });
                }
            }
        });
        registerMessage(privMessage);

        var namesMessage = new Message(function (parts)
        {
            return parts[1] === "353";
        }, function (parts)
        {
            var channel = Channel.get(parts[4]);
            parts = parts.slice(5).filter(function (n)
            {
                return n;
            });

            for (var i = 0; i < parts.length; i++)
            {
                if (["+", "%", "@"].indexOf(parts[i][0]) != -1)
                {
                    var user = User.get(parts[i].substring(1));
                } else
                {
                    var user = User.get(parts[i]);
                }
                channel.addUser(user);
            }

            Connection.send("WHO " + channel.name);
        });
        registerMessage(namesMessage);

        var whoMessage = new Message(function (parts)
        {
            return parts[1] === "352";
        }, function (parts)
        {
            parts = parts.slice(3).filter(function (n) { return n });
            var channel = Channel.get(parts[0]);
            var user = User.get(parts[4]);

            var username = parts[1];
            var rank = parts[5].charAt(parts[5].length - 1);

            if (rank != "" && ["+", "%", "@"].indexOf(rank) != -1)
            {
                $rootScope.$apply(function () { user.ranks[channel.name] = rank });
            }

            var colorflag_regexp = /^([0-9a-f]{3}|[0-9a-f]{6})([a-z]{2})$/i;
            var matches = username.match(colorflag_regexp);

            if (matches != null)
            {
                $rootScope.$apply(function ()
                {
                    user.color = "#" + matches[1];
                    user.flag = matches[2];
                });
            }

            $http.jsonp("http://api.worldbank.org/countries/" + user.flag + "?format=jsonp&prefix=JSON_CALLBACK").success(function (data)
            {
                if (data[1][0].name)
                {
                    user.country = data[1][0].name;
                }
            });

            channel.sortusers();
        });
        registerMessage(whoMessage);

        var whoisuserMessage = new Message(function (parts)
        {
            return parts[1] === "311";
        }, function (parts)
        {
            parts = parts.slice(3).filter(function (n) { return n });
            var user = User.get(parts[0]);
            var username = parts[1];

            var colorflag_regexp = /^([0-9a-f]{3}|[0-9a-f]{6})([a-z]{2})$/i;
            var matches = username.match(colorflag_regexp);

            if (matches != null)
            {
                $rootScope.$apply(function ()
                {
                    user.color = "#" + matches[1];
                    user.flag = matches[2];
                });
            }

            $http.jsonp("http://api.worldbank.org/countries/" + user.flag + "?format=jsonp&prefix=JSON_CALLBACK").success(function (data)
            {
                if (data[1][0].name)
                {
                    user.country = data[1][0].name;
                }
            });
        });
        registerMessage(whoisuserMessage);

        var whoischannelsMessage = new Message(function (parts)
        {
            return parts[1] === "319";
        }, function (parts)
        {
            parts = parts.slice(3).filter(function (n) { return n });
            var user = User.get(parts[0]);

            for (var i = 1; i < parts.length; i++)
            {
                if (["+", "%", "@"].indexOf(parts[i][0]) != -1)
                {
                    var rank = parts[i][0];
                    var channel = Channel.get(parts[i].substring(1));

                    if (channel)
                    {
                        user.ranks[channel.name] = rank;
                        channel.sortusers();
                    }
                } else
                {
                    var channel = Channel.get(parts[i]);

                    if (channel)
                    {
                        user.ranks[channel.name] = "";
                        channel.sortusers();
                    }
                }
            }
        });
        registerMessage(whoischannelsMessage);

        var joinMessage = new Message(function (parts)
        {
            return parts[1] === "JOIN";
        }, function (parts)
        {
            var user = getUser(parts);
            var channel = Channel.get(parts[2]);

            if (user.nickName === User.get("~").nickName)
            {
                var switchToChannel = channel === undefined;

                channel = channel || Channel.register(parts[2]);

                if (switchToChannel)
                {
                    $location.path("/channels/" + parts[2]);
                }

                $rootScope.$broadcast("channel.joined", channel);
            } else
            {
                channel.addLine(user.nickName + " joined the room.");
                channel.addUser(user);
                channel.sortusers();
            }

            Connection.send("WHOIS " + user.nickName);
        });
        registerMessage(joinMessage);

        var partMessage = new Message(function (parts)
        {
            return parts[1] === "PART";
        }, function (parts)
        {
            var user = getUser(parts);
            var channel = Channel.get(parts[2]);
            var reason = parts.slice(3).join(" ");

            if (user.nickName !== User.get("~").nickName)
            {
                if (reason == null)
                {
                    channel.addLine(user.nickName + " left the room.");
                } else
                {
                    channel.addLine(user.nickName + " left the room (" + reason + ").");
                }
                channel.users.splice(channel.users.indexOf(user), 1);
            }
        });
        registerMessage(partMessage);

        var quitMessage = new Message(function (parts)
        {
            return parts[1] === "QUIT";
        }, function (parts)
        {
            var user = getUser(parts);
            var reason = parts.slice(2).join(" ");

            var channels = Channel.all();
            for (var i = 0; i < channels.length; i++)
            {
                if (channels[i].users.indexOf(user) != -1)
                {
                    if (reason == null)
                    {
                        channels[i].addLine(user.nickName + " quit.");
                    } else
                    {
                        channels[i].addLine(user.nickName + " quit (" + reason + ").");
                    }
                    channels[i].users.splice(channels[i].users.indexOf(user), 1);
                }
            }
        });
        registerMessage(quitMessage);

        var topicMessage = new Message(function (parts)
        {
            return parts[1] === "332";
        }, function (parts)
        {
            parts = parts.slice(3).filter(function (n) { return n });
            var channel = Channel.get(parts[0]);

            if (channel != null)
            {
                $rootScope.$apply(function () { channel.topic = parts.slice(1).join(" ") });
            }
        });
        registerMessage(topicMessage);

        var topicinfoMessage = new Message(function (parts)
        {
            return parts[1] === "333";
        }, function (parts)
        {
            parts = parts.slice(3).filter(function (n) { return n });
            var channel = Channel.get(parts[0]);
            var user;
            var regexp = /^([a-z0-9_\-\[\]\\^{}|`]+)!([a-z0-9_\.\-\~]+)\@([a-z0-9\.\-]+)/i;
            var matches = parts[1].match(regexp);

            if (matches !== null)
            {
                user = User.get(matches[1]);
            }

            $rootScope.$apply(function ()
            {
                channel.topicauthor = user;
                var date = new Date(parts[2] * 1000);
                channel.topicdate = date.toLocaleString();
            });
        });
        registerMessage(topicinfoMessage);

        var topicchangeMessage = new Message(function (parts)
        {
            return parts[1] === "TOPIC";
        }, function (parts)
        {
            var author = getUser(parts);
            var channel = Channel.get(parts[2]);
            var topic = parts.slice(3).join(" ");
            var date = new Date(Date.now());

            $rootScope.$apply(function ()
            {
                channel.topic = topic;
                channel.topicauthor = author;
                channel.topicdate = date.toLocaleString();
            });
            channel.addLine("Topic was changed by " + author.nickName + ".");
        });
        registerMessage(topicchangeMessage);

        var kickMessage = new Message(function (parts)
        {
            return parts[1] === "KICK";
        }, function (parts)
        {
            var kicker = getUser(parts);
            var channel = Channel.get(parts[2]);
            var target = User.get(parts[3]);
            var reason = parts.slice(4).join(" ");

            if (target.nickName === User.get("~").nickName)
            {
                if (reason == null)
                {
                    channel.addLine("You were kicked by " + kicker.nickName + ".");
                } else
                {
                    channel.addLine("You were kicked by " + kicker.nickName + " (" + reason + ").");
                }
                $rootScope.$apply(function () { channel.users.length = 0 });
            } else
            {
                if (reason == null)
                {
                    channel.addLine(target.nickName + " was kicked by " + kicker.nickName + ".");
                } else
                {
                    channel.addLine(target.nickName + " was kicked by " + kicker.nickName + " (" + reason + ").");
                }
                $rootScope.$apply(function () { channel.users.splice(channel.users.indexOf(target), 1) });
            }
        });
        registerMessage(kickMessage);

        var modeMessage = new Message(function (parts)
        {
            return parts[1] === "MODE";
        }, function (parts)
        {
            var setter = getUser(parts);
            var target = parts[2];
            var modes = parts[3];
            var parameters = parts.slice(4);

            if (target === User.get("~").nickName)
            {
                //this is my mode, ignore
            } else
            {
                target = Channel.get(target);
                //this is a channel mode
                var action = "";
                var currMode = "";
                var paramIndex = 0;
                var userTarget;
                for (var i = 0; i < modes.length; i++)
                {
                    switch (modes[i])
                    {
                        case '+':
                            action = "sets";
                            break;
                        case '-':
                            action = "removes";
                            break;
                        case 'i':
                            currMode = "invite only";
                            break;
                        case 'm':
                            currMode = "moderated";
                            break;
                        case 'n':
                            currMode = "no outside messages";
                            break;
                        case 'p':
                            currMode = "private";
                            break;
                        case 's':
                            currMode = "secret";
                            break;
                        case 't':
                            currMode = "topic protection";
                            break;
                        case 'v':
                            currMode = "voice";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action === "sets")
                            {
                                userTarget.addRank(target, '+');
                            } else if (action === "removes")
                            {
                                userTarget.removeRank(target, '+');
                            }
                            paramIndex++;
                            break;
                        case 'h':
                            currMode = "halfop";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action === "sets")
                            {
                                userTarget.addRank(target, '%');
                            } else if (action === "removes")
                            {
                                userTarget.removeRank(target, '%');
                            }
                            paramIndex++;
                            break
                        case 'o':
                            currMode = "op";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action === "sets")
                            {
                                userTarget.addRank(target, '@');
                            } else if (action === "removes")
                            {
                                userTarget.removeRank(target, '@');
                            }
                            paramIndex++;
                            break;
                        default:

                    }

                    if ("imnpst".indexOf(modes[i]) != -1)
                    {
                        target.addLine(setter.nickName + " " + action + " mode \"" + currMode + "\".");
                    } else if ("vho".indexOf(modes[i]) != -1)
                    {
                        if (action === "sets")
                        {
                            target.addLine(setter.nickName + " gives " + currMode + " to " + userTarget.nickName + ".");
                        } else if (action === "removes")
                        {
                            target.addLine(setter.nickName + " " + action + " " + currMode + " from " + userTarget.nickName + ".");
                        }
                    }
                }
            }
        });
        registerMessage(modeMessage);

        var nickMessage = new Message(function (parts)
        {
            return parts[1] === "NICK";
        }, function (parts)
        {
            var user = getUser(parts);
            var newNickName = parts[2];

            console.log(Channel.all());

            var channels = Channel.all();

            for (var i = 0; i < channels.length; i++)
            {
                var channel = channels[i];

                console.log(channel);

                if (user.nickName === User.get("~").nickName)
                {
                    channel.addLine("You were previously " + user.nickName + ".");
                } else
                {
                    channel.addLine(newNickName + " was previously " +
                                    user.nickName + ".");
                }
            }

            $rootScope.$apply(function ()
            {
                User.move(user.nickName, newNickName);

                user.nickName = newNickName;
            })
        });
        registerMessage(nickMessage);

        var actionMessage = new Message(function (parts)
        {
            return getCTCP(parts) === "ACTION";
        }, function (parts)
        {
            console.log("Received CTCP ACTION");
        });
        registerMessage(actionMessage);

        $rootScope.$on("channel.join", function (evt, channel)
        {
            Connection.send("JOIN " + channel.name);
        });

        $rootScope.$on("channel.close", function (evt, channel)
        {
            Connection.send("PART " + channel.name);
        });

        return {
            parse: function (line)
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
