Services.factory("Parser",
    ["$http", "$location", "$rootScope", "$window", "$log", "Connection",
    "Channel", "User", "Query", "Server",
    function ($http, $location, $rootScope, $window, $log, Connection,
    Channel, User, Query, Server)
    {
        var messages = [];

        function Message(check, process)
        {
            message = {};
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
            var prefixRe = /^:([^ ]+) +/;
            var cmdRe = /^([^ ]+) */;
            var argRe = /(.*?)(?:^:|\s+:)(.*)/;

            //match prefix
            match = line.match(prefixRe);
            if (match !== null)
            {
                ircline.prefix = match[1];
                line = line.replace(prefixRe, "");
            }

            //match cmd
            match = line.match(cmdRe);
            ircline.cmd = match[1];
            line = line.replace(/^[^ ]+ ?/, "");

            //match args
            ircline.args = [];
            var middle, trailing;

            if (line.search(/^:|\s+:/) != -1)
            {
                match = line.match(argRe);
                middle = match[1].replace(/\s+$/, "");
                trailing = match[2];
            } 

            else if (line.length)
            {
                middle = line;
            }

            if (middle && middle.length)
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
            var usermaskRe = /^([a-z0-9_\-\[\]\\^{}|`]+)!([a-z0-9_\.\-\~]+)\@([a-z0-9\.\-]+)/i;
            var matches = prefix.match(usermaskRe);

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

        function parsePrefix(prefix)
        {
            var parsed = {};
            var usermaskRe = /^([a-z0-9_\-\[\]\\^{}|`]+)!([a-z0-9_\-\~]+)\@([a-z0-9\.\-]+)/i;
            var matches = prefix.match(usermaskRe);

            if (matches !== null)
            {
                parsed.nickName = matches[1];
                parsed.userName = matches[2];
                parsed.hostName = matches[3];

                return parsed;
            }

            else
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
                "315",
                "671"
            ];

        var _serverMessage = new Message(function (ircline)
        {
            return ircline.prefix === "irc.frogbox.es" && serverMessageBlacklist.indexOf(ircline.cmd) < 0;
        }, function (ircline)
        {
            var server = Server.get("Server");
            server.addLine("[" + ircline.cmd + "] " + ircline.args.slice(1).join(" "));
        });
        registerMessage(_serverMessage);

        var welcomeHandlers = [];

        var rpl_welcomeMessage = new Message(function (ircline)
        {
            return ircline.cmd === "001";
        }, function (ircline)
        {
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

            if (ircline.prefix == "irc.frogbox.es")
            {
                return;
            }

            if (ircline.prefix.indexOf("services@frogbox.es") > -1)
            {
                var service = getUser(ircline.prefix);
                var server = Server.get("Server");
                server.addLine(line, service);
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

            if (channel !== null)
            {
                $rootScope.$broadcast("channel.message", {
                    channel: channel,
                    user: user,
                    line: line
                });
            } 

            else
            {
                var query = Query.get(user.nickName) ||
                            Query.register(user.nickName);

                if (query !== null)
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
            users = users.filter(function (n) { return n; });

            for (var i = 0; i < users.length; i++)
            {
                var ranks, nick = "";
                for (var j = 0; j < users[i].length; j++) 
                {
                    if (["+", "%", "@", "&", "~"].indexOf(users[i][j]) > -1)
                    {
                        ranks += users[i][j];
                    } 

                    else
                    {
                        nick = users[i].slice(j, users[i].length);
                        break;
                    }
                }

                var user = User.get(nick);
                user.ranks[channel] = ranks;

                channel.addUser(user);
                user.addChannel(channel);
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

            user.userName = ircline.args[2];
            user.hostName = ircline.args[3];

            var modifiers = ircline.args[6];
            var modifierRe = /(G|H)(\*?)([~&@%+]*)/;
            var modifierMatches = modifiers.match(modifierRe);
            var awayflag = modifierMatches[1];
            var ranks = modifierMatches[3];

            if (awayflag === "G")
            {
                Connection.send("WHOIS " + user.nickName);
            } 

            else if (awayflag === "H")
            {
                user.awayMsg = null;
            }

            for (var rank in ranks)
            {
                user.addRank(channel, ranks[rank]);
            }

            var colorflagRe = /^([0-9a-f]{3}|[0-9a-f]{6})([a-z]{2})$/i;
            var matches = user.userName.match(colorflagRe);

            if (matches !== null)
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
            user.userName = ircline.args[2];
            user.hostName = ircline.args[3];

            var colorflagRe = /^([0-9a-f]{3}|[0-9a-f]{6})([a-z]{2})$/i;
            var matches = user.userName.match(colorflagRe);

            if (matches !== null)
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
            var userChannels = ircline.args[2].split(" ");

            for (var i = 0; i < userChannels.length; i++)
            {
                if (["+", "%", "@", "&", "~"].indexOf(userChannels[i][0]) != -1)
                {
                    var rank = userChannels[i][0];
                    var channel = Channel.get(userChannels[i].substring(1));

                    if (channel)
                    {
                        user.addRank(channel, rank);
                    }
                } 

                else
                {
                    var channel = Channel.get(userChannels[i]);

                    if (channel)
                    {
                        $rootScope.$apply(function ()
                        {
                            user.ranks[channel.name] = "";
                        });
                    }
                }
            }
        });
        registerMessage(rpl_whoischannelsMessage);

        var awayMessage = new Message(function (ircline)
        {
            return ircline.cmd === "AWAY";
        }, function (ircline)
        {
            var user = getUser(ircline.prefix);
            user.awayMsg = ircline.args[0];
        });
        registerMessage(awayMessage);

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
            var server = Server.get("Server");
            server.addLine("You are no longer marked as being away.");
        });
        registerMessage(rpl_unawayMessage);

        var rpl_nowawayMessage = new Message(function (ircline)
        {
            return ircline.cmd === "306";
        }, function (ircline)
        {
            var server = Server.get("Server");
            server.addLine("You have been marked as being away.");
        });
        registerMessage(rpl_nowawayMessage);

        var joinMessage = new Message(function (ircline)
        {
            return ircline.cmd === "JOIN";
        }, function (ircline)
        {
            var parsedUser = parsePrefix(ircline.prefix);

            if (!parsedUser)
                return;

            var user = User.get(parsedUser.nickName);
            user.userName = parsedUser.userName;
            user.hostName = parsedUser.hostName;

            var channel = Channel.get(ircline.args[0]);

            if (user.nickName === User.get("~").nickName)
            {
                var switchToChannel = channel === null;

                channel = channel || Channel.register(ircline.args[0]);
                // Make sure the name of the channel is the same as it's registered on the server
                Channel.set(channel.name, ircline.args[0]);

                if (switchToChannel)
                {
                    $location.path("/channels/" + ircline.args[0]);
                }

                $rootScope.$broadcast("channel.joined", channel);
            } 

            else
            {
                channel.addLine(user.nickName + " joined the room.");
                channel.addUser(user);
            }

            user.addChannel(channel);

            Connection.send("WHOIS " + user.nickName);
        });
        registerMessage(joinMessage);

        var partMessage = new Message(function (ircline)
        {
            return ircline.cmd === "PART";
        }, function (ircline)
        {
            var user = getUser(ircline.prefix);
            var client = User.get("~");
            var channel = Channel.get(ircline.args[0]);
            var reason = ircline.args[1];

            if (user.nickName !== client.nickName)
            {
                if (reason === null)
                {
                    channel.addLine(user.nickName + " left the room.");
                } else
                {
                    channel.addLine(user.nickName + " left the room (" + reason + ").");
                }
                channel.users.splice(channel.users.indexOf(user), 1);

                user.removeChannel(channel.name);

                // Check what channels we share with this user
                for (var i = 0; i < user.channels.length; i++) {
                    if (client.channels.indexOf(user.channels[i]) >= 0)
                    {
                        // There is a common channel, so don't delete this user
                        return;
                    }
                }

                // We didn't find a common channel
                User.delete(user.nickName);
            } 

            else 
            {
                // Don't remove the channel from the user's list when he parts
                channel.addLine("You left the room.");
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
                    if (reason === null)
                    {
                        channels[i].addLine(user.nickName + " quit.");
                    } else
                    {
                        channels[i].addLine(user.nickName + " quit (" + reason + ").");
                    }
                    channels[i].users.splice(channels[i].users.indexOf(user), 1);

                    // We can safely delete the user since he quit from all common channels
                    User.delete(user.nickName);
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

            if (channel !== null)
            {
                $rootScope.$apply(function () { channel.topic = ircline.args[2]; });
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
            } else {
                user = User.get(ircline.args[2]);
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
                if (reason === null)
                {
                    channel.addLine("You were kicked by " + kicker.nickName + ".");
                } else
                {
                    channel.addLine("You were kicked by " + kicker.nickName + " (" + reason + ").");
                }
                $rootScope.$apply(function () { channel.users.length = 0; });
            } else
            {
                if (reason === null)
                {
                    channel.addLine(target.nickName + " was kicked by " + kicker.nickName + ".");
                } else
                {
                    channel.addLine(target.nickName + " was kicked by " + kicker.nickName + " (" + reason + ").");
                }
                $rootScope.$apply(function () { channel.users.splice(channel.users.indexOf(target), 1); });
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
                            if (action == "set")
                            {
                                userTarget.addRank(target, '+');
                            } else if (action == "removed")
                            {
                                userTarget.removeRank(target, '+');
                            }
                            paramIndex++;
                            break;
                        case 'h':
                            currMode = "halfop";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action == "set")
                            {
                                userTarget.addRank(target, '%');
                            } else if (action == "removed")
                            {
                                userTarget.removeRank(target, '%');
                            }
                            paramIndex++;
                            break;
                        case 'o':
                            currMode = "op";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action == "set")
                            {
                                userTarget.addRank(target, '@');
                            } else if (action == "removed")
                            {
                                userTarget.removeRank(target, '@');
                            }
                            paramIndex++;
                            break;
                        case 'a':
                            currMode = "admin";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action == "set")
                            {
                                userTarget.addRank(target, '&');
                            } else if (action == "removed")
                            {
                                userTarget.removeRank(target, '&');
                            }
                            paramIndex++;
                            break;
                        case 'q':
                            currMode = "owner";
                            userTarget = User.get(parameters[paramIndex]);
                            if (action == "set")
                            {
                                userTarget.addRank(target, '~');
                            } else if (action == "removed")
                            {
                                userTarget.removeRank(target, '~');
                            }
                            paramIndex++;
                            break;
                        default:

                    }

                    if ("imnpst".indexOf(modes[i]) != -1)
                    {
                        target.addLine(setter.nickName + " " + action + " mode \"" + currMode + "\".");
                    } else if ("vhoaq".indexOf(modes[i]) != -1)
                    {
                        if (action == "set")
                        {
                            target.addLine(setter.nickName + " gave " + currMode + " to " + userTarget.nickName + ".");
                        } else if (action == "removed")
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
                var server = Server.get("Server");
                server.addLine(ircline.args[1] + " ban on " + mask + " set on " + time.toLocaleString() + " by \\b" + setter + "\\r.");
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

                if ($.inArray(user, channel.users) === -1) {
                    continue;
                }

                if (user.nickName === User.get("~").nickName)
                {
                    channel.addLine("You are now known as " + newNickName +
                                    ".");
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
            });
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

        var pingCTCPMessage = new Message(function (ircline)
        {
            return getCTCP(ircline) === "PING";
        }, function (ircline)
        {
            var user = getUser(ircline.prefix);
            Connection.send("NOTICE " + user.nickName + 
                " \u0001PING " + ircline.args[1].split(' ')[1]);
        });
        registerMessage(pingCTCPMessage);

        var timeCTCPMessage = new Message(function (ircline)
        {
            return getCTCP(ircline) === "TIME";
        }, function (ircline)
        {
            var user = getUser(ircline.prefix);
            Connection.send("NOTICE " + user.nickName +
                " \u0001TIME " + Date.now() +
                "\u0001");
        });
        registerMessage(timeCTCPMessage);

        $rootScope.$on("channel.join", function (evt, channel)
        {
            Connection.send("JOIN " + channel.name);
        });

        $rootScope.$on("channel.part", function (evt, leave)
        {
            if (leave.reason)
                Connection.send("PART " + leave.channel.name + " :" + leave.reason);
            else
                Connection.send("PART " + leave.channel.name);
        });

        return {
            parse: function (line)
            {
                $log.log("> " + line);

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
