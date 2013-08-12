Services.factory("Notifications", ["$filter", "$rootScope", function ($filter, $rootScope)
{
    var highlighted = false;
    var unread = 0;

    $rootScope.$on("highlighted", function (evt, message)
    {
        highlighted = true;
        document.title = "Coldstorm" + " | " + message.channel.name + " (***)";
    });

    $rootScope.$on("unread", function (evt, message)
    {
        unread++;
        if (highlighted === false)
        {
            document.title = "Coldstorm" + " | " + message.channel.name + " (" + unread + ")";
        }
    });

    $rootScope.$on("read", function (evt)
    {
        highlighted = false;
        unread = 0;
    });

    return {
        requestNotify: function ()
        {
            if (window.webkitNotifications.checkPermission() != 0)
            {
                window.webkitNotifications.requestPermission();
            }
        },

        notify: function (channel, author, message)
        {
            window.webkitNotifications.createNotification("/favicon.png", "Coldstorm" + " (" + channel + ") ",
                "[" + $filter("date")(new Date(), "HH:mm") + "] " + author + ": " + message).show();
        }
    };
}])