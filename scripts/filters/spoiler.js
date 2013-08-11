Filters.filter("spoiler", ["$compile", function ($compile)
{
    return function (input)
    {
        var line = input;

        line = line.replace(/::(.+?)::/g, '<span class="spoiler">$1</span>');

        return line;
    };
}]);
