Services.factory("Notifications", ["$filter", "$rootScope", function ($filter, $rootScope)
{
    var highlighted = false;
    var unread = 0;

    $rootScope.$on("highlighted", function (evt, message)
    {
        highlighted = true;
        document.title = "Coldstorm" + " | " + message.channel.name + " (***)";
        notify(message.channel.name, message.user.nickName, message.line);
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

    var notify = function (channel, author, message)
    {
        if (window.webkitNotifications.checkPermission() == 0)
        {
            window.webkitNotifications.createNotification("/favicon.png", "Coldstorm" + " (" + channel + ") ",
                "[" + $filter("date")(new Date(), "HH:mm") + "] " + author + ": " + message).show();
        }
    }

    $rootScope.requestNotifications = function ()
    {
        if (window.webkitNotifications.checkPermission() != 0)
        {
            window.webkitNotifications.requestPermission();
        }
    }
}])