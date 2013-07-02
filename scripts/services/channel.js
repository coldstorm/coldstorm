Coldstorm.provider("Channel", function()
{
    var registry = { };
    
    this.$get = function()
    {
        this.register = function(name)
        {
            name = name.replace("%23", "#");
            
            registry[name] = {
                addLine: function(message, author)
                {
                    line = {
                        author: null,
                        message: "",
                        systemMessage: false,
                        time: new Date()
                    };
                    
                    if (author)
                    {
                        line.author = author;
                    } else
                    {
                        line.systemMessage = true;
                    }
                    
                    line.message = message;
                    
                    this.lines.push(line);
                    
                    return this;
                },
                addUser: function(user)
                {
                    this.users.push(user);
                    
                    return this;
                },
                active: true,
                lines: [],
                name: name,
                topic: "Temporary topic",
                users: []
            };
            
            registry[name].addLine("You joined the room.");
            
            return registry[name];
        };
        
        this.all = function()
        {
            var channels = [];
            
            for (channel in registry)
            {
                channels.push(registry[channel]);
            }
            
            return channels;
        };
        
        this.get = function(name)
        {
            return registry[name];
        };
        
        return this;
    };
});
