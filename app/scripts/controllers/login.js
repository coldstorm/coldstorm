Controllers.controller("LoginCtrl",
    ["$log", "$scope", "$http", "$rootScope", "$location", "$timeout", "$filter",
    "Connection", "User", "Channel", "Server", "YouTube", "Parser", "Settings",
    function ($log, $scope, $http, $rootScope, $location, $timeout, $filter,
    Connection, User, Channel, Server, YouTube, Parser, Settings)
    {       
        var mustKill = false;
        $scope.time = new Date(); // Used for timestamp in preview

        //Get Channels from URL
        var channelParam = $location.search().channels;
        if (channelParam != null) //If present
        {
            $scope.channel = "#" + channelParam.replace(',',',#');
        }
        else //Default
        {
            $scope.channel = "";
            //If saved channels, add them
            if ($rootScope.settings.PRESERVE_CHANNELS &&
                $rootScope.settings.CHANNELS &&
                $rootScope.settings.CHANNELS.length > 0)
            {
                for (var i = 0; i < $rootScope.settings.CHANNELS.length; i++) 
                {
                    $scope.channel = $scope.channel + $rootScope.settings.CHANNELS[i] + ((i + 1 === $rootScope.settings.CHANNELS.length) ? '' : ',');
                }
            }
            else if (VERSION == "local")
            {
                $scope.channel = "#test"; //Local Version joins Test Channel
            }
            else 
            {
                $scope.channel = "#Coldstorm,#2"; //Normal version joins #coldstorm & #2
            }
        }

        //Setup user
        $scope.user = User.get("~");
        $scope.user.nickName = $.cookie("nickName");
        if ($.cookie("color"))
        {
            $scope.user.color = $.cookie("color");
        }

        $location.hash("");

        // GeoIP service for location 
        $http.jsonp("https://geoip.yonom.org/index.php?callback=JSON_CALLBACK")
        .success(function (data)
        {
            $scope.user.country = data.geoplugin_countryName;
            $scope.user.flag = data.geoplugin_countryCode;
        });

        $rootScope.$on("err_nicknameinuse", function (evt)
        {
            if ($scope.user.password)
            {
                Connection.send("NICK " + $scope.user.nickName + "_");

                mustKill = true;

                return;
            }

            Connection.close();
            setError("Nickname is in use");
        });

        $rootScope.$on("disconnecting", function (evt)
        {
            if (Connection.isConnected()) // Don't change the channels array unless we were really connected
            {
                if ($rootScope.settings.PRESERVE_CHANNELS)
                {
                    $rootScope.settings.CHANNELS = [];
                    var user = User.get("~");
                    for (var i = 0; i < user.channels.length; i++)
                    {
                        // Only store the channel name
                        $rootScope.settings.CHANNELS[i] = user.channels[i];
                    }

                    Settings.save($rootScope.settings);
                }
            }
        });

        var setError = function (err)
        {
            $scope.error = err;
            if ($rootScope.$$phase != "$apply")
            {
                $rootScope.$digest();
            }
        };

        var joinChannels = function ()
        {
            var channelNames = $scope.channel.split(",");
            var channels = [];
            var pageSet = false;
            for (var i = 0; i < channelNames.length; i++) 
            {
                channelNames[i] = $.trim(channelNames[i]);
                if (RegExp(/([#&][a-zA-Z0-9]{0,25})/).test(channelNames[i]))
                {
                    channels[i] = Channel.register(channelNames[i]);
                    channels[i].join();
                    if (pageSet === false)
                    {
                        $location.path("/channels/" + channelNames[i]);
                    }
                    pageSet = true;
                }
            }
        };

        var cyclePort = function ()
        {
            if (VERSION === "local")
            {
                $scope.port = 81;
            } 

            else
            {
                $scope.port = 80 + (Math.floor(Math.random() * (5 - 2 + 1) + 2));
            }
            $scope.port = 8081;
        };

        var registerEventHandlers = function ()
        {
            Connection.onOpen(connection_onOpen);
            Connection.onWelcome(connection_onWelcome);
            Connection.onMessage(connection_onMessage);
            Connection.onClose(connection_onClose);
            $log.log("registerEventHandlers() events registered");
        };

        $scope.login = function ()
        {
            // jQuery trim the nickname to prevent whitespace names
            $.trim($scope.user.nickName);

            try
            {
                User.register($scope.user.nickName);
                User.alias("~", $scope.user.nickName);
            }

            catch (e) // For catching "Undefined name"
            {
                setError(e);
                return;
            }

            $.cookie("nickName", $scope.user.nickName, { expires: new Date(2017, 00, 01) });
            $.cookie("color", $scope.user.color, { expires: new Date(2017, 00, 01) });

            $scope.connect();
        };

        $scope.connect = function ()
        {
            if (Connection.isOpen() || Connection.isConnected())
            {
                Connection.close();
            }
            
            // Generate new port
            cyclePort();

            registerEventHandlers();
            // Attempt to connect
            $log.log("connecting to ws://frogbox.es:" + $scope.port);
            Connection.connect("ws://frogbox.es:" + $scope.port);
        };

        var connection_onOpen = function ()
        {
            Server.register("Server");
            $location.path("/server");

            // Capability negotiation
            Connection.send("CAP REQ :away-notify");
            Connection.send("CAP REQ :multi-prefix");
            Connection.send("CAP END");

            // Registration process
            Connection.send("NICK " + $scope.user.nickName);
            Connection.send("USER " +
                $scope.user.color.substring(1).toUpperCase() +
                $scope.user.flag + " - - :New coldstormer");
        };

        var connection_onWelcome = function ()
        {
            if (mustKill)
            {
                Connection.send("PRIVMSG NickServ :GHOST " +
                    $scope.user.nickName + " " +
                    $scope.user.password);
            }

            // Do fixip2 here to ensure that we are already connected and Jessica will respond
            $http.jsonp("http://kaslai.com/coldstorm/fixip2.php?nick=" + encodeURI($scope.user.nickName) + "&random=" +
                Math.floor(Math.random() * 10000000) +
                "&callback=JSON_CALLBACK").success(function (data)
            {
                $scope.hostToken = data.tag;
                Connection.send("PRIVMSG Jessica :~fixmyip " + 
                    $scope.hostToken);
            });

        };

        var connection_onMessage = function (message)
        {
            if (message.indexOf("NOTICE " + $scope.user.nickName +
                " :Tada") > -1)
            {
                if ($scope.user.password)
                {
                    Connection.send("PRIVMSG NickServ :identify " +
                        $scope.user.password);
                }

                else
                {
                    joinChannels();
                }
            }

            if (message.indexOf("NickServ!services@frogbox.es NOTICE " + $scope.user.nickName + 
                " :Password accepted - you are now recognized.") > -1)
            {
                joinChannels();
            }

            if (message.indexOf("NOTICE " + $scope.user.nickName +
                "_ :Ghost with your nick has been killed.") > -1 &&
                mustKill)
            {
                Connection.send("NICK " + $scope.user.nickName);
                Connection.send("PRIVMSG NickServ :IDENTIFY " +
                    $scope.user.password);

                mustKill = false;

                if ($scope.hostToken)
                {
                    Connection.send("PRIVMSG Jessica :~fixmyip " +
                        $scope.hostToken);
                }
            }

            Parser.parse(message);

        };

        var connection_onClose = function ()
        {
            $location.path("/login");
        };
    }]);
