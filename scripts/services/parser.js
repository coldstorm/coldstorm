Services.factory("Parser",
    ["$http", "$location", "$rootScope", "$window", "$log", "Connection",
    "Channel", "User", "Query", "Server", "AwayChecker", 
    function ($http, $location, $rootScope, $window, $log, Connection,
    Channel, User, Query, Server, AwayChecker)
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

        function clean(line)
        {
            //taken from https://github.com/martynsmith/node-irc/blob/master/lib/irc.js
            var ircline = {};
            var match;

            //regexes
            var prefix_re = /^:([^ ]+) +/;
            var cmd_re = /^([^ ]+) */;
            var arg_re = /(.*?)(?:^:|\s+:)(.*)/;

            //match prefix
            if (match = line.match(prefix_re))
            {
                ircline.prefix = match[1];
                line = line.replace(prefix_re, "");
            }

            //match cmd
            match = line.match(cmd_re);
            ircline.cmd = match[1];
            line = line.replace(/^[^ ]+ +/, "");

            //match args
            ircline.args = [];
            var middle, trailing;

            if (line.search(/^:|\s+:/) != -1)
            {
                match = line.match(arg_re);
                middle = match[1].replace(/\s+$/, "");
                trailing = match[2];
            } else
            {
                middle = line;
            }

            if (middle.length)
            {
                ircline.args = middle.split(/ +/);
            }

            if (typeof (trailing) != "undefined" && trailing.length)
            {
                ircline.args.push(trailing);
            }

            for (var i = 0; i < ircline.args.length; i++)
            {
                ircline.args[i].trim();
            }

            return ircline;
        }

        function getQuery(parts)
        {
            return Query.get(parts[2]);
        }

        function getUser(prefix)
        {
            var regexp = /^([a-z0-9_\-\[\]\\^{}|`]+)!([a-z0-9_\.\-\~]+)\@([a-z0-9\.\-]+)/i;
            var matches = prefix.match(regexp);

            if (matches !== null)
            {
                return User.get(matches[1]);
            }

            return null;
        }

        // Checks if the message is a CTCP message and returns the CTCP command or null
        function getCTCP(ircline)
        {
            if ((ircline.cmd === "NOTICE" || ircline.cmd === "PRIVMSG") && ircline.args[1].indexOf("\u0001") === 0)
            {
                var ctcp = ircline.args[1].replace(/\u0001/g, "");

                var action = ctcp.split(" ");

                return action[0];
            }

            return null;
        }

        var serverMessageBlacklist =
            [
                "332",
                "333",
                "352",
                "353",
                "366",
                "311",
                "378",
                "319",
                "312",
                "301",
                "379",
                "317",
                "318",
                "330",
                "307",
                "315"
            ];

        var _serverMessage = new Message(function (ircline)
        {
            return ircline.prefix === "Frogbox.es"
                && serverMessageBlacklist.indexOf(ircline.cmd) < 0;
        }, function (ircline)
        {
            Server.addLine("[" + ircline.cmd + "] " + ircline.args.slice(1).join(" "));
        });
        registerMessage(_serverMessage);

        var welcomeHandlers = [];

        var rpl_welcomeMessage = new Message(function (ircline)
        {
            return ircline.cmd === "001";
        }, function (ircline)
        {
            AwayChecker.start();
            for (var i = 0; i < welcomeHandlers.length; i++)
            {
                welcomeHandlers[i]();
            }
        });
        registerMessage(rpl_welcomeMessage);

        Connection.onWelcome = function (handler)
        {
            welcomeHandlers.push(handler);
        };

        var noticeMessage = new Message(function (ircline)
        {
            // Only check notices
            if (ircline.cmd !== "NOTICE")
            {
                return false;
            }

            // Ignore CTCP responses
            if (getCTCP(ircline) !== null)
            {
                return false;
            }

            // Ignore anything from Jessica
            if (ircline.prefix.indexOf("Jessica") === 0)
            {
                return false;
            }

            return true;
        }, function (ircline)
        {
            var line = ircline.args.slice(1).join(" ");

            if (ircline.prefix == "Frogbox.es")
            {
                return;
            }

            if (ircline.prefix.indexOf("services@frogbox.es") > -1)
            {
                var service = getUser(ircline.prefix)
                Server.addLine(line, service);
                return;
            }

            var user = getUser(ircline.prefix);

            privMessage.process(ircline);
        });
        registerMessage(noticeMessage);

        var rpl_motdMessage = new Message(function (ircline)
        {
            return ircline.cmd === "372";
        }, function (ircline)
        {
            return;
        });
        registerMessage(rpl_motdMessage);

        var pingMessage = new Message(function (ircline)
        {
            return ircline.cmd === "PING";
        }, function (ircline)
        {
            Connection.send("PONG " + ircline.args[0]);
        });
        registerMessage(pingMessage);

        var privMessage = new Message(function (ircline)
        {
            return (ircline.cmd === "PRIVMSG" &&
                    getCTCP(ircline) === null);
        }, function (ircline)
        {
            var channel = Channel.get(ircline.args[0]);
            var user = getUser(ircline.prefix);
            var line = ircline.args.slice(1).join(" ");

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

        var rpl_namreplyMessage = new Message(function (ircline)
        {
            return ircline.cmd === "353";
        }, function (ircline)
        {
            var channel = Channel.get(ircline.args[2]);
            var users = ircline.args[3].split(" ");
            users = users.filter(function (n) { return n });

            for (var i = 0; i < users.length; i++)
            {
                if (["+", "%", "@"].indexOf(users[i][0]) != -1)
                {
                    var user = User.get(users[i].substring(1));
                } else
                {
                    var user = User.get(users[i]);
                }
                channel.addUser(user);
            }

            Connection.send("WHO " + channel.name);
        });
        registerMessage(rpl_namreplyMessage);

        var rpl_whoreplyMessage = new Message(function (ircline)
        {
            return ircline.cmd === "352";
        }, function (ircline)
        {
            var channel = Channel.get(ircline.args[1]);
            var user = User.get(ircline.args[5]);

            var username = ircline.args[2];
            var awayflag = ircline.args[6][0];

            if (awayflag === "G")
            {
                Connection.send("WHOIS " + user.nickName);
            } else if (awayflag === "H")
            {
                user.awayMsg = null;
            }

            var rank = ircline.args[6].charAt(ircline.args[6].length - 1);

            if (rank != "" && ["+", "%", "@"].indexOf(rank) != -1)
            {
                user.addRank(channel, rank);
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

            if (user.country === "Unknown")
            {
                $http.jsonp("http://api.worldbank.org/countries/" + user.flag + "?format=jsonp&prefix=JSON_CALLBACK").success(function (data)
                {
                    if (data[1])
                    {
                        user.country = data[1][0].name;
                    } else
                    {
                        user.country = "Outlaw";
                    }
                });
            }
        });
        registerMessage(rpl_whoreplyMessage);

        var rpl_whoisuserMessage = new Message(function (ircline)
        {
            return ircline.cmd === "311";
        }, function (ircline)
        {
            var user = User.get(ircline.args[1]);
            var username = ircline.args[2];

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

            if (user.country === "Unknown")
            {
                $http.jsonp("http://api.worldbank.org/countries/" + user.flag + "?format=jsonp&prefix=JSON_CALLBACK").success(function (data)
                {
                    if (data[1])
                    {
                        user.country = data[1][0].name;
                    } else
                    {
                        user.country = "Outlaw";
                    }
                });
            }
        });
        registerMessage(rpl_whoisuserMessage);

        var rpl_whoischannelsMessage = new Message(function (ircline)
        {
            return ircline.cmd === "319";
        }, function (ircline)
        {
            var user = User.get(ircline.args[1]);

            for (var i = 2; i < ircline.args.length; i++)
            {
                if (["+", "%", "@"].indexOf(ircline.args[i][0]) != -1)
                {
                    var rank = ircline.args[i][0];
                    var channel = Channel.get(ircline.args[i].substring(1));

                    if (channel)
                    {
                        user.addRank(channel, rank);
                    }
                } else
                {
                    var channel = Channel.get(ircline.args[i]);

                    if (channel)
                    {
                        $rootScope.$apply(function () { user.ranks[channel.name] = ""; });
                    }
                }
            }
        });
        registerMessage(rpl_whoischannelsMessage);

        var rpl_awayMessage = new Message(function (ircline)
        {
            return ircline.cmd === "301";
        }, function (ircline)
        {
            var user = User.get(ircline.args[1]);
            user.awayMsg = ircline.args[2];
        });
        registerMessage(rpl_awayMessage);

        var rpl_unawayMessage = new Message(function (ircline)
        {
            return ircline.cmd === "305";
        }, function (ircline)
        {
            Server.addLine("You are no longer marked as being away.");
        });
        registerMessage(rpl_unawayMessage);

        var rpl_nowawayMessage = new Message(function (ircline)
        {
            return ircline.cmd === "306";
        }, function (ircline)
        {
            Server.addLine("You have been marked as being away.");
        });
        registerMessage(rpl_nowawayMessage);

        var joinMessage = new Message(function (ircline)
        {
            return ircline.cmd === "JOIN";
        }, function (ircline)
        {
            var user = getUser(ircline.prefix);
            var channel = Channel.get(ircline.args[0]);

            if (user.nickName === User.get("~").nickName)
            {
                var switchToChannel = channel === undefined;

                channel = channel || Channel.register(ircline.args[0]);

                if (switchToChannel)
                {
                    $location.path("/channels/" + ircline.args[0]);
                }

                $rootScope.$broadcast("channel.joined", channel);

                AwayChecker.register(channel);
            } else
            {
                channel.addLine(user.nickName + " joined the room.");
                channel.addUser(user);
            }

            Connection.send("WHOIS " + user.nickName);
        });
        registerMessage(joinMessage);

        var partMessage = new Message(function (ircline)
        {
            return ircline.cmd === "PART";
        }, function (ircline)
        {
            var user = getUser(ircline.prefix);
            var channel = Channel.get(ircline.args[0]);
            var reason = ircline.args[1];

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

        var quitMessage = new Message(function (ircline)
        {
            return ircline.cmd === "QUIT";
        }, function (ircline)
        {
            var user = getUser(ircline.prefix);
            var reason = ircline.args[0];

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

        var rpl_topicMessage = new Message(function (ircline)
        {
            return ircline.cmd === "332";
        }, function (ircline)
        {
            var channel = Channel.get(ircline.args[1]);

            if (channel != null)
            {
                $rootScope.$apply(function () { channel.topic = ircline.args[2] });
            }
        });
        registerMessage(rpl_topicMessage);

        var rpl_topicwhotimeMessage = new Message(function (ircline)
        {
            return ircline.cmd === "333";
        }, function (ircline)
        {
            var channel = Channel.get(ircline.args[1]);
            var user;
            var regexp = /^([a-z0-9_\-\[\]\\^{}|`]+)!([a-z0-9_\.\-\~]+)\@([a-z0-9\.\-]+)/i;
            var matches = ircline.args[2].match(regexp);

            if (matches !== null)
            {
                user = User.get(matches[1]);
            }

            $rootScope.$apply(function ()
            {
                channel.topicauthor = user;
                var date = new Date(ircline.args[3] * 1000);
                channel.topicdate = date.toLocaleString();
            });
        });
        registerMessage(rpl_topicwhotimeMessage);

        var topicchangeMessage = new Message(function (ircline)
        {
            return ircline.cmd === "TOPIC";
        }, function (ircline)
        {
            var author = getUser(ircline.prefix);
            var channel = Channel.get(ircline.args[0]);
            var topic = ircline.args[1];
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

        var kickMessage = new Message(function (ircline)
        {
            return ircline.cmd === "KICK";
        }, function (ircline)
        {
            var kicker = getUser(ircline.prefix);
            var channel = Channel.get(ircline.args[0]);
            var target = User.get(ircline.args[1]);
            var reason = ircline.args[2];

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

        var modeMessage = new Message(function (ircline)
        {
            return ircline.cmd === "MODE";
        }, function (ircline)
        {
            var setter = getUser(ircline.prefix);
            var target = ircline.args[0];
            var modes = ircline.args[1];
            var parameters = ircline.args.slice(2);

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
                            action = "set";
                            break;
                        case '-':
                            action = "removed";
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
                            if (action === "set")
                            {
                                userTarget.addRank(target, '+');
                            } else if (action === "removed")
                            {
                                userTarget.removeRank(target, '+');
                            }
                            paramIndex++;
                            break;
                        case 'h':
                            currMode = "halfop";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action === "set")
                            {
                                userTarget.addRank(target, '%');
                            } else if (action === "removed")
                            {
                                userTarget.removeRank(target, '%');
                            }
                            paramIndex++;
                            break
                        case 'o':
                            currMode = "op";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action === "set")
                            {
                                userTarget.addRank(target, '@');
                            } else if (action === "removed")
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
                        if (action === "set")
                        {
                            target.addLine(setter.nickName + " gave " + currMode + " to " + userTarget.nickName + ".");
                        } else if (action === "removed")
                        {
                            target.addLine(setter.nickName + " " + action + " " + currMode + " from " + userTarget.nickName + ".");
                        }
                    } else if ("b".indexOf(modes[i]) != -1)
                    {
                        target.addLine(setter.nickName + " " + action + " ban on " + parameters[paramIndex] + ".");
                    }
                }
            }
        });
        registerMessage(modeMessage);

        var rpl_banlistMessage = new Message(function (ircline)
        {
            return ircline.cmd === "367";
        }, function (ircline)
        {
            var channel = Channel.get(ircline.args[1]);
            var mask = ircline.args[2];
            var setter = ircline.args[3];
            var time = new Date(ircline.args[4] * 1000);

            if (channel)
            {
                channel.addLine("Ban on \\u" + mask + "\\r set on " + time.toLocaleString() + " by \\b" + setter + "\\r.");
            } else
            {
                Server.addLine(ircline.args[1] + " ban on " + mask + " set on " + time.toLocaleString() + " by \\b" + setter + "\\r.");
            }
        });
        registerMessage(rpl_banlistMessage);

        var nickMessage = new Message(function (ircline)
        {
            return ircline.cmd === "NICK";
        }, function (ircline)
        {
            var user = getUser(ircline.prefix);
            var newNickName = ircline.args[0];

            //console.log(Channel.all());

            var channels = Channel.all();

            for (var i = 0; i < channels.length; i++)
            {
                var channel = channels[i];

                //console.log(channel);

                if (user.nickName === User.get("~").nickName)
                {
                    channel.addLine("You are now known as " + newNickName + ".");
                } else
                {
                    channel.addLine(user.nickName + " is now known as " +
                                    newNickName + ".");
                }
            }

            $rootScope.$apply(function ()
            {
                User.move(user.nickName, newNickName);

                user.nickName = newNickName;
            })
        });
        registerMessage(nickMessage);

        var err_nicknameinuseMessage = new Message(function (ircline)
        {
            return ircline.cmd === "433";
        }, function (ircline)
        {
            $rootScope.$broadcast("err_nicknameinuse");
        });
        registerMessage(err_nicknameinuseMessage);

        var actionCTCPMessage = new Message(function (ircline)
        {
            return getCTCP(ircline) === "ACTION";
        }, function (ircline)
        {
            privMessage.process(ircline);
        });
        registerMessage(actionCTCPMessage);

        var versionCTCPMessage = new Message(function (ircline)
        {
            return getCTCP(ircline) === "VERSION";
        }, function (ircline)
        {
            //console.log("Received CTCP VERSION");
            var user = getUser(ircline.prefix);
            Connection.send("NOTICE " + user.nickName +
                " \u0001VERSION Coldstorm Web Client (" +
                $rootScope.meta.version + ")\u0001");
        });
        registerMessage(versionCTCPMessage);

        var browserCTCPMessage = new Message(function (ircline)
        {
            return getCTCP(ircline) === "BROWSER";
        }, function (ircline)
        {
            //console.log("Received CTCP BROWSER");
            var user = getUser(ircline.prefix);
            Connection.send("NOTICE " + user.nickName +
                " \u0001BROWSER " + $window.navigator.userAgent +
                "\u0001");
        });
        registerMessage(browserCTCPMessage);

        $rootScope.$on("channel.join", function (evt, channel)
        {
            Connection.send("JOIN " + channel.name);
        });

        $rootScope.$on("channel.close", function (evt, channel)
        {
            Connection.send("PART " + channel.name);

            AwayChecker.unregister(channel);
        });

        return {
            parse: function (line)
            {
                $log.log("< " + line);

                var ircline = clean(line);
                for (var mIndex = 0; mIndex < messages.length; mIndex++)
                {
                    var message = messages[mIndex];

                    if (message.check(ircline))
                    {
                        message.process(ircline);
                    }
                }
            },

            addMessage: registerMessage
        };
    }]);
