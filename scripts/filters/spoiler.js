Filters.filter("spoiler", ["$filter", function ($filter)
{
    return function (input)
    {
        var line = input;

        line = line.replace(/::(.+?)::/, "<spoiler>$1</spoiler>");

        return line;
    };
}]);
