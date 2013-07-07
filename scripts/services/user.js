Coldstorm.provider("User", function()
{
    var currentUser = "";
    
    var registry = { };
    
    this.$get = function()
    {
        var provider = { };
        
        provider.register = function(name, color, flag, rank)
        {
            registry[name] = {
                color: color != null ? color : "#FFFFFF",
                country: "United States",
                flag: flag != null ? flag : "US",
                nickName: name,
                rank: rank != null ? rank : ""
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
