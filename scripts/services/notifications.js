Services.factory("Notifications", ["$filter", function ($filter)
{
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