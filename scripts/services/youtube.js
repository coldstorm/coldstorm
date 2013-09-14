Services.factory("YouTube", ["$rootScope", function ($rootScope)
{
    var registry = {};

    var youtubes = {
        register: function (id)
        {
            registry[id] = {
                time: "",
                id: id,
                name: id,
                active: false,
                close: function ()
                {
                    $rootScope.$broadcast("yt.close", this);

                    delete registry[this.id];
                }
            };

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