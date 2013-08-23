Controllers.controller("LoginCtrl",
    ["$scope", "$http", "$rootScope", "$location", "$timeout", "$filter",
    "$cookies", "Connection", "User", "Channel", "Parser",
    function ($scope, $http, $rootScope, $location, $timeout, $filter,
    $cookies, Connection, User, Channel, Parser)
    {
        var mustKill = false;
        $scope.user = User.get("~");
        $scope.user.nickName = $cookies.nickName;
        if ($cookies.color)
        {
            $scope.user.color = $cookies.color;
        }

        $location.hash("");

        $http.jsonp("http://freegeoip.net/json/?callback=JSON_CALLBACK")
        .success(function (data)
        {
            $scope.user.country = data.country_name;
            $scope.user.flag = data.country_code;
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
            $scope.connecting = false;
            $scope.connected = false;

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

        $scope.connecting = false;
        $scope.connected = false;
        $scope.hostToken = "";

        if (VERSION === "local")
        {
            $scope.port = 82;
        } else
        {
            $scope.port = 81;
        }
        $scope.error = "";

        $scope.login = function ()
        {
            User.register($scope.user.nickName);
            User.alias("~", $scope.user.nickName);

            $http.jsonp("http://kaslai.us/coldstorm/fixip2.php?nick=" +
                encodeURI($scope.user.nickName) + "&random=" +
                Math.floor(Math.random() * 10000000) +
		"&callback=JSON_CALLBACK").success(function (data)
			{
			    $scope.hostToken = data.tag;
			});

            $cookies.nickName = $scope.user.nickName;
            $cookies.color = $scope.user.color;

            $scope.connect();

            while ($scope.connected === false)
            {
                if ($scope.retry() === false)
                {
                    break;
                }
            }
        };

        $scope.connect = function ()
        {
            if ($scope.connecting === false)
            {
                $scope.connecting = true;
		    
                Connection.connect("ws://frogbox.es:" + $scope.port);
                Connection.onOpen(function ()
                {
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
                    if ($scope.connected)
                    {
                        $location.path("/login");
                        $scope.connected = false;
                    }
                });
            }
        };

        $scope.retry = function ()
        {
            while ($scope.port < 85)
            {
                $scope.port++;
                $scope.connect();
                return true;
            }
            return false;
        }
    }]);
