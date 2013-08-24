Filters.filter("line", ["$filter", function ($filter)
{
    return function (input)
    {
        var line = input;

        line = $filter("linky")(line);

        line = line.replace("<a href", '<a target="_blank" href');

        line = $filter("ctcpAction")(line);
        line = $filter("spoiler")(line);
        line = $filter("highlight")(line);
        line = $filter("inlineImage")(line);
        line = $filter("reset")(line);
        line = $filter("color")(line);
        line = $filter("bold")(line);
        line = $filter("underline")(line);
        line = $filter("italics")(line);

        return line;
    };
}]);
