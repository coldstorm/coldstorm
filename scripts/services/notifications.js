Services.factory("Notifications", ["$filter", "$rootScope","$timeout", function ($filter, $rootScope, $timeout)
{
    var highlighted = false;
    var unread = 0;

    $rootScope.$on("highlighted", function (evt, message)
    {
        highlighted = true;
        setTitle(message.channel.name);
        document.title = "Coldstorm" + " | " + message.channel.name + " (***)";
        notify(message.channel.name, message.user.nickName, message.line);
    });

    $rootScope.$on("unread", function (evt, message)
    {
        unread++;
        if (highlighted == false)
        {
            setTitle(message.channel.name, unread);
        }
    });

    $rootScope.$on("read", function (evt)
    {
        setTitle();
        highlighted = false;
        unread = 0;
    });

    var setTitle = function (channel, messages)
    {
        $timeout(function ()
        {
            if (channel == null)
            {
                document.title = "Coldstorm";
            } else if (messages == null)
            {
                document.title = "Coldstorm" + " | " + channel + " (***)";
            } else
            {
                document.title = "Coldstorm" + " | " + channel + " (" + messages + ")";
            }
        }, 300);
    }

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