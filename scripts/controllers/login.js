Controllers.controller("LoginCtrl",
    ["$scope", "$http", "$rootScope", "$location", "$timeout", "$filter",
    "$cookies", "Connection", "User", "Channel", "Parser",
    function ($scope, $http, $rootScope, $location, $timeout, $filter,
    $cookies, Connection, User, Channel, Parser)
    {
        $scope.displayModal = false;
        $scope.modalOpts =
            {
                backdropFade: true,
                dialogFade: true
            };
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

        $scope.openModal = function ()
        {
            $scope.displayModal = true;
        }

        $scope.closeModal = function ()
        {
            $scope.displayModal = false;
        }

        $rootScope.$on("err_nicknameinuse", function (evt)
        {
            console.log("err_nicknameinuse received");
            $scope.openModal();
        });

        $scope.connecting = false;

        $scope.login = function ()
        {
            if ($scope.connecting === false)
            {
                $scope.connecting = true;
                var hostToken = "";

                $http.jsonp("http://kaslai.us/coldstorm/fixip.php?nick=" +
                    encodeURI($scope.user.nickName) + "&random=" +
                    Math.floor(Math.random() * 10000000));

                $cookies.nickName = $scope.user.nickName;
                $cookies.color = $scope.user.color;

                hostToken = md5($scope.user.nickName);

                if (VERSION == "local")
                {
                    Connection.connect("ws://frogbox.es:82");
                } else
                {
                    Connection.connect("ws://frogbox.es:81");
                }

                Connection.onOpen(function ()
                {
                    Connection.send("NICK " + $scope.user.nickName);
                    Connection.send("USER " +
                        $scope.user.color.substring(1).toUpperCase() +
                        $scope.user.flag + " - - :New coldstormer");

                    Connection.onWelcome(function ()
                    {
                        if ($scope.user.password)
                        {
                            Connection.send("PRIVMSG NickServ :identify " +
                                $scope.user.password);
                        }

                        if (hostToken)
                        {
                            Connection.send("PRIVMSG Jessica :~fixmyip " +
                                hostToken);
                        }

                        $rootScope.requestNotifications();
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

                    Parser.parse(message);
                });

                Connection.onClose(function ()
                {
                    console.log("Closed");
                });
            }
        };
    }]);
