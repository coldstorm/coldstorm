Filters.filter("line", ["$filter", function ($filter)
{
    return function (input)
    {
        var line = input;

        line = $filter("linky")(line);

        line = line.replace("<a href", '<a target="_blank" href');

        line = $filter("spoiler")(line);
        line = $filter("highlight")(line);

        return line;
    };
}]);
