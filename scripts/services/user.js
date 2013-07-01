Coldstorm.provider("User", function()
{
    var currentUser = "";
    
    var registry = { };
    
    this.$get = function()
    {
        var provider = { };
        
        provider.register = function(name)
        {
            registry[name] = {
                color: "#FFFFFF",
                country: "United States",
                flag: "us",
                nickName: name,
            };
            
            if (name == "~")
            {
                registry[name].nickName = "";
            }
            
            return registry[name];
        };
        
        provider.get = function(name)
        {
            if (name in registry)
            {
                return registry[name];
            } else {
                return provider.register(name);
            }
        };
        
        return provider;
    };
});
