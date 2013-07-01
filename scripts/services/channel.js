Coldstorm.provider("Channel", function()
{
    var registry = { };
    
    this.$get = function()
    {
        this.register = function(name)
        {
            registry[name] = {
                name: name,
                topic: "",
                users: []
            };
            
            return registry[name];
        };
        
        this.all = function()
        {
            var channels = [];
            
            for (channel in registry)
            {
                channels.push(registry[channel]);
            }
            console.log(channels);
            return channels;
        };
        
        this.get = function(name)
        {
            return registry[name];
        };
        
        return this;
    };
});
