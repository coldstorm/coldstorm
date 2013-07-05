Coldstorm.factory("Connection", function()
{
    var connection = new Websock();
    
    var openHandlers = [];
    var messageHandlers = [];
    var closeHandlers = [];
    
    connection.on("open", function()
    {
        for (var handlerIndex = 0; handlerIndex < openHandlers.length; handlerIndex++)
        {
            var handler = openHandlers[handlerIndex];
            
            handler();
        }
    });
    
    connection.on("message", function()
    {
        var messages = connection.rQshiftStr().split("\r\n");
        messages = messages.filter(function(n) { return n });
        
        for (var messageIndex = 0; messageIndex < messages.length; messageIndex++)
        {
            var message = messages[messageIndex];
            
            for (var handlerIndex = 0; handlerIndex < messageHandlers.length; handlerIndex++)
            {
                var handler = messageHandlers[handlerIndex];
                
                handler(message);
            }
        }
    });
    
    connection.on("close", function()
    {
        for (var handlerIndex = 0; handlerIndex < closeHandlers.length; handlerIndex++)
        {
            var handler = closeHandlers[handlerIndex];
            
            handler();
        }
    });
    
    return {
        connect: function(uri)
        {
            connection.open(uri);
        },
        onOpen: function(handler)
        {
            openHandlers.push(handler);
        },
        onMessage: function(handler)
        {
            messageHandlers.push(handler);
        },
        onClose: function(handler)
        {
            closeHandlers.push(handler);
        },
        send: function(message)
        {
            connection.send_string(unescape(encodeURIComponent(message + "\r\n")));
            console.log("> " + message);
        }
    };
});
