Services.factory("YouTube", ["$rootScope", "$http", function ($rootScope, $http)
{
    var registry = {};

    var youtubes = {
        register: function (id)
        {
            registry[id] = {
                id: id,
                name: id,
                active: false,
                close: function ()
                {
                    $rootScope.$broadcast("youtube.close", this);

                    delete registry[this.id];
                }
            };

            $http.jsonp("http://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=json-in-script&callback=JSON_CALLBACK")
                .success(function (data)
                {
                    registry[id].name = data.entry.title.$t;
                });

            return registry[id];
        },

        all: function ()
        {
            var youtubes = [];

            for (youtube in registry)
            {
                youtubes.push(registry[youtube]);
            }

            return youtubes;
        },

        get: function (id)
        {
            return registry[id];
        }
    };

    return youtubes;
}]);