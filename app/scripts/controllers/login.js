Controllers.controller("LoginCtrl",
    ["$log", "$scope", "$http", "$rootScope", "$location", "$timeout", "$filter",
    "Connection", "User", "Channel", "YouTube", "Parser",
    function ($log, $scope, $http, $rootScope, $location, $timeout, $filter,
    Connection, User, Channel, YouTube, Parser)
    {
        var mustKill = false;
        $scope.user = User.get("~");
        $scope.user.nickName = $.cookie("nickName");
        if ($.cookie("color"))
        {
            $scope.user.color = $.cookie("color");
        }

        $location.hash("");

        $http.jsonp("http://geoip.yonom.org/index.php?callback=JSON_CALLBACK")
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

            $rootScope.$apply(function ()
            {
                $scope.error = "Nickname is in use";
            });
        });

        $rootScope.$on("channel.joined", function (evt, channel)
        {
            $scope.connecting = false;
            $scope.connected = false;
            $scope.error = "";
        });

        $scope.reset = function ()
        {
            $scope.connecting = false;
            $scope.connected = false;

            if (VERSION === "local")
            {
                $scope.port = 81;
            } else
            {
                $scope.port = 82;
            }
            $scope.error = "";
        }

        $scope.login = function ()
        {
            $scope.reset();
            User.register($scope.user.nickName);
            User.alias("~", $scope.user.nickName);

            $http.jsonp("http://kaslai.us/coldstorm/fixip2.php?nick=" +
                encodeURI($scope.user.nickName) + "&random=" +
                Math.floor(Math.random() * 10000000) +
		        "&callback=JSON_CALLBACK").success(function (data)
		        {
		            $scope.hostToken = data.tag;
		        });

            $.cookie("nickName", $scope.user.nickName, { expires: new Date(2017, 00, 01) });
            $.cookie("color", $scope.user.color, { expires: new Date(2017, 00, 01) });

            $scope.connect();
        };

        $scope.connect = function ()
        {
            if ($scope.connecting === false)
            {
                $scope.connecting = true;


                // Attempt to connect
                $log.log("connecting to ws://frogbox.es:" + $scope.port)
                Connection.connect("ws://frogbox.es:" + $scope.port);

                $timeout(function ()
                {
                    if ($scope.connecting)
                    {
                        Connection.close();
                    }
                }, 30000)

                Connection.onOpen(function ()
                {
                    // Connection successfully opened
                    $scope.reset();
                    $scope.connected = true;

                    $location.path("/server");

                    Connection.send("NICK " + $scope.user.nickName);
                    Connection.send("USER " +
                        $scope.user.color.substring(1).toUpperCase() +
                        $scope.user.flag + " - - :New coldstormer");

                    Connection.onWelcome(function ()
                    {
                        if (mustKill)
                        {
                            Connection.send("PRIVMSG NickServ :GHOST " +
                                $scope.user.nickName + " " +
                                $scope.user.password);
                        }

                        if ($scope.user.password)
                        {
                            Connection.send("PRIVMSG NickServ :identify " +
                                $scope.user.password);
                        }

                        if ($scope.hostToken)
                        {
                            Connection.send("PRIVMSG Jessica :~fixmyip " +
                                $scope.hostToken);
                        }
                    });
                });

                Connection.onMessage(function (message)
                {
                    if (message.indexOf("NOTICE " + $scope.user.nickName +
                        " :Tada") > -1)
                    {
                        if (VERSION == "local")
                        {
                            var test = Channel.register("#test");

                            test.join();

                            $location.path("/channels/#test");
                        } else
                        {
                            var cs = Channel.register("#Coldstorm");
                            var two = Channel.register("#2");

                            cs.join();
                            two.join();

                            $location.path("/channels/#Coldstorm");
                        }
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
                });

                Connection.onClose(function ()
                {
                    $scope.connecting = false;
                    if ($scope.connected)
                    {
                        // We were already connected and on the chat view, go back to login
                        $location.path("/login");
                        $scope.reset();
                    }

                    else
                    {
                        if ($scope.port < 85)
                        {
                            $scope.port++;
                            $scope.connect();
                        } else
                        {
                            $rootScope.$apply(function ()
                            {
                                $scope.error = "Couldn't connect to the server";
                            })
                        }
                    }
                });
            }
        };
    }]);
