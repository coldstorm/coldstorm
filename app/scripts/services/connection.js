Services.factory("Connection", ["$log", function ($log)
{
    var connection = new Websock();

    var openHandlers = [];
    var messageHandlers = [];
    var closeHandlers = [];
    var errorHandlers = [];

    var open = false; // The Websocket is in an OPEN state but not necessarily connected yet
    var connected = false; // The Websocket is connected

    connection.on("open", function ()
    {
        for (var handlerIndex = 0; handlerIndex < openHandlers.length; handlerIndex++)
        {
            var handler = openHandlers[handlerIndex];

            handler();
        }

        connected = true;
    });

    connection.on("message", function ()
    {
        var messages = connection.rQshiftStr().split("\r\n");
        messages = messages.filter(function (n) { return n; });

        for (var messageIndex = 0; messageIndex < messages.length; messageIndex++)
        {
            var message = decodeURIComponent(escape(messages[messageIndex]));

            for (var handlerIndex = 0; handlerIndex < messageHandlers.length; handlerIndex++)
            {
                var handler = messageHandlers[handlerIndex];

                handler(message);
            }
        }
    });

    connection.on("close", function ()
    {
        for (var handlerIndex = 0; handlerIndex < closeHandlers.length; handlerIndex++)
        {
            var handler = closeHandlers[handlerIndex];

            handler();
        }
        openHandlers.length = 0;
        messageHandlers.length = 0;
        closeHandlers.length = 0;
        errorHandlers.length = 0;

        open = false;
        connected = false;
    });

    connection.on("error", function ()
    {
        for (var handlerIndex = 0; handlerIndex < errorHandlers.length; handlerIndex++)
        {
            var handler = errorHandlers[handlerIndex];

            handler();
        }

    });


    return {
        connect: function (uri)
        {
            connection.open(uri);
            open = true;
        },
        close: function ()
        {
            connection.close();
        },
        isOpen: function ()
        {
            return open;
        },
        isConnected: function ()
        {
            return connected;
        },
        onOpen: function (handler)
        {
            openHandlers.push(handler);
        },
        onMessage: function (handler)
        {
            messageHandlers.push(handler);
        },
        onClose: function (handler)
        {
            closeHandlers.push(handler);
        },
        onError: function (handler)
        {
            errorHandlers.push(handler);
        },
        send: function (message)
        {
            message = message.replace(/\\c/gi, "\u0003");
            message = message.replace(/\\b/gi, "\u0002");
            message = message.replace(/\\u/gi, "\u001F");
            message = message.replace(/\\s/gi, "\u001D");
            message = message.replace(/\\i/gi, "\u001D");
            message = message.replace(/\\o/gi, "\u000F");

            connection.send_string(unescape(encodeURIComponent(message + "\r\n")));

            $log.log("< " + message);
        }
    };
}]);
