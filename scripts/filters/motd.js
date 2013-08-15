Filters.filter("motd", ["$filter", function ($filter)
{
    return function (input)
    {
        var motd = input;

        motd = $filter("linky")(line);

        motd = line.replace("<a href", '<a target="_blank" href');

        motd = $filter("color")(line);

        return line;
    };
}]);