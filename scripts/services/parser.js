Coldstorm.factory("Parser", ["Connection", function(Connection)
{
    var messages = [];
    
    function Message(check, process)
    {
        message = new Object();
        message.check = check;
        message.process = process;
        
        return message;
    }
    
    function registerMessage(message)
    {
        messages.push(message);
    }
    
    function clean(parts)
    {
        for (var i = 0; i < parts.length; i++)
        {
            if (parts[i][0] == ':') 
            {
                parts[i] = parts[i].substring(1);
            }
        }
        
        return parts;
    }
    
    var noticeMessage = new Message(function(parts){return (parts[1]=="NOTICE")}, function(parts){console.log("< " + parts.join(" "))});
    registerMessage(noticeMessage);
    var motdMessage = new Message(function(parts){return (parts[1]=="372")}, function(parts){console.log("< " + parts.join(" "))});
    registerMessage(motdMessage);
    var pingMessage = new Message(function(parts){return (parts[0]=="PING")}, function(parts){console.log("< " + parts.join(" ")); Connection.send("PONG " + parts[1])});
    registerMessage(pingMessage);
    
    return {
        
        parse: function(line)
        {
            var parts = clean(line.split(" "));
            
            for (var mIndex = 0; mIndex < messages.length; mIndex++)
            {
                var message = messages[mIndex];
                
                if (message.check(parts))
                {
                    message.process(parts);
                }
            }
        },
        
        addMessage: registerMessage
    };
}]);