Services.factory("Notifications",
["$filter", "$rootScope","$timeout", "Settings",
function ($filter, $rootScope, $timeout, Settings)
{
    var highlighted = false;
    var unread = 0;

    $rootScope.$on("highlighted", function (evt, message)
    {
        highlighted = true;
        setTitle(message.channel.name);
        notify(message.channel.name, message.user.nickName, message.line);
        playPing();
    });

    $rootScope.$on("highlighted_pm", function (evt, message)
    {
        highlighted = true;
        setTitle(message.user.nickName, "PM");
        notify("PM", message.user.nickName, message.line);
        playPing();
    });

    $rootScope.$on("unread", function (evt, message)
    {
        unread++;
        if (highlighted == false)
        {
            setTitle(message.channel.name, unread);
        }
    });

    $rootScope.$on("unread_pm", function (evt, message)
    {
        unread++;
        if (highlighted == false)
        {
            setTitle(message.user.nickName, "PM");
            notify("PM", message.user.nickName, message.line);
        }
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
    var canNotify = false;

    var notify = function (location, notifier, message)
    {
        if ($rootScope.settings.DESKTOP_NOTIFICATIONS)
        {
            if (supportsNotifications)
            {
                if (canNotify)
                {
                    var title = "Coldstorm" + " (" + location + ") ";
                    var tag = "chat_" + location;
                    var body = "[" + $filter("date")(new Date(), "HH:mm") + "] " + notifier + ": " + message;
                    var notification = new Notification(title,
                        {
                            tag: tag,
                            icon: "//coldstorm.github.io/coldstorm/app/favicon.png",
                            body: body
                        });

                    if ($rootScope.settings.FADE_NOTIFICATIONS_TIME > 0)
                    {
                        $timeout(function ()
                        {
                            notification.close();
                        }, $rootScope.settings.FADE_NOTIFICATIONS_TIME * 1000);
                    }
                }
            }
        }
    }

    var checkNotifications = function ()
    {
        try
        {
            var welcome_notification = new Notification("Welcome to Coldstorm!", 
                {
                    tag: "welcome",
                    icon: "//coldstorm.github.io/coldstorm/app/favicon.png",
                });

            if (welcome_notification.permission === "granted")
            {
                canNotify = true;
            }
            supportsNotifications = true;
            $timeout(function () { welcome_notification.close(); }, 1000);
        }
        catch (err)
        {
            supportsNotifications = false;
        }
    }

    $rootScope.requestNotifications = function ()
    {
        checkNotifications();
        if (canNotify === false)
        {
            Notification.requestPermission(function (perm)
            {
                if (perm === "granted")
                {
                    canNotify = true;
                }
            });
        }
    }

    var playPing = function ()
    {
        if ($rootScope.settings.SOUND_NOTIFICATIONS)
        {
            $("#ping").get(0).load();
            $("#ping").get(0).play();
        }
    }
}])

