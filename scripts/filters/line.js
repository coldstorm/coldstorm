Filters.filter("line", ["$sanitize", "$filter", function ($sanitize, $filter)
{
    return function (input)
    {
        var line = input.replace(/&/g, '&amp;').
                         replace(/</g, '&lt;').
                         replace(/>/g, '&gt;').
                         replace(/'/g, '&#39;').
                         replace(/"/g, '&quot;');

        line = $filter("linky")(input);

        return line;
    };
}]);
