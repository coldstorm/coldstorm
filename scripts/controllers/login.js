Coldstorm.controller("LoginCtrl",
    ["$scope", "$http", "$rootScope", "$location", "$timeout", "Connection", "User", "Channel", "Parser",
    function ($scope, $http, $rootScope, $location, $timeout, Connection, User, Channel, Parser)
    {
        $scope.user = User.get("~");

        $http.jsonp("http://freegeoip.net/json/?callback=JSON_CALLBACK").success(function (data)
        {
            $scope.user.country = data.country_name;
            $scope.user.flag = data.country_code;
        });

        $scope.login = function ()
        {
            var cs = Channel.register("#Coldstorm");
            var two = Channel.register("#2");

            var test = Channel.register("#test");

            Connection.connect("ws://coldstorm.tk:81");

            Connection.onOpen(function ()
            {
                Connection.send("NICK " + $scope.user.nickName);
                Connection.send("USER " + $scope.user.color.substring(1).toUpperCase() +
                    $scope.user.flag + " - - :New coldstormer");

                Connection.onWelcome(function ()
                {
                    test.join();
                });
            });

            Connection.onMessage(function (message)
            {
                Parser.parse(message);
            });

            Connection.onClose(function ()
            {
                console.log("Closed");
            });

            $location.path("/channels/#Coldstorm");
        };
    }]);
