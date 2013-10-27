Filters.filter("spoiler", ["$compile", function ($compile)
{
    return function (input)
    {
        var line = input;

        line = line.replace(/::(.+?)::/g, '\\c01,01$1\\o');

        return line;
    };
}]);
