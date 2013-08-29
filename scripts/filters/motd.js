Filters.filter("motd", ["$filter", function ($filter)
{
    return function (input)
    {
        if (input)
        {
            var motd = input;

            motd = $filter("linky")(motd);

            motd = motd.replace("<a href", '<a target="_blank" href');

            motd = $filter("color")(motd);

            return motd;
        } else
        {
            return input;
        }
    };
}]);