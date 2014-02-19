Services.factory("AppNotification",
["$rootScope", 
function ($rootScope)
{
    $rootScope.appNotification = "This is a test notification.";

    return {
        dismiss: function ()
        {
            $rootScope.appNotification = "";
        }
    };
}]);