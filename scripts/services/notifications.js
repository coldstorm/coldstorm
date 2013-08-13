Services.factory("Notifications", ["$filter", "$rootScope","$timeout", function ($filter, $rootScope, $timeout)
{
    var highlighted = false;
    var unread = 0;

    $rootScope.$on("highlighted", function (evt, message)
    {
        highlighted = true;
        setTitle(message.channel.name);
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

    $rootScope.$on("query.message", function (evt, message)
    {
        if (highlighted == false)
        {
            setTitle(message.user.nickName, "PM");
        }
        notify("PM", message.user.nickName, message.line);
    });

    $rootScope.$on("read", function (evt)
    {
        setTitle();
        highlighted = false;
        unread = 0;
    });

    var setTitle = function (notifier, event)
    {
        $timeout(function ()
        {
            if (notifier == null)
            {
                document.title = "Coldstorm";
            } else if (event == null)
            {
                document.title = "(***) " + notifier + " | Coldstorm";
            } else
            {
                document.title = "(" + event + ") " + notifier + " | Coldstorm";
            }
        }, 300);
    }

    var supportsNotifications = false;

    var notify = function (location, notifier, message)
    {
        if (supportsNotifications)
        {
            if (window.webkitNotifications.checkPermission() == 0)
            {
                window.webkitNotifications.createNotification("//coldstorm.github.io/coldstorm/favicon.png", "Coldstorm" + " (" + location + ") ",
                    "[" + $filter("date")(new Date(), "HH:mm") + "] " + notifier + ": " + message).show();
            }
        }
    }

    var checkNotifications = function ()
    {
        if (window.webkitNotifications)
        {
            supportsNotifications = true;
        } else
        {
            supportsNotifications = false;
        }
    }

    $rootScope.requestNotifications = function ()
    {
        checkNotifications();
        if (supportsNotifications)
        {
            if (window.webkitNotifications.checkPermission() != 0)
            {
                window.webkitNotifications.requestPermission();
            }
        }
    }
}])