Coldstorm.provider("User", function()
{
    var currentUser = "";
    
    var registry = { };
    
    this.$get = function()
    {
        var provider = { };
        
        provider.register = function(name, color, country, flag)
        {
            registry[name] = {
                color: color != null ? color : "#BABBBF",
                country: country != null ? country : "Outlaw",
                flag: flag != null ? flag : "QQ",
                nickName: name,
                ranks: []
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
