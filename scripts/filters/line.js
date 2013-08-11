Filters.filter("line", ["$filter", function ($filter)
{
    return function (input)
    {
        var line = input.replace(/&/g, '&amp;').
                         replace(/</g, '&lt;').
                         replace(/>/g, '&gt;').
                         replace(/'/g, '&#39;').
                         replace(/"/g, '&quot;');

        line = $filter("linky")(line);
        line = $filter("spoiler")(line);
        line = $filter("highlight")(line);

        return line;
    };
}]);
