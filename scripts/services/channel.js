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
        };
        
        this.get = function(name)
        {
            return registry[name];
        };
        
        return this;
    };
});
