Filters.filter("color", [function ()
{
    return function (input)
    {
        var line = input.replace(/\\c/gi, "\u0003");
        line = line.replace(/\u0003([0-9]{1,2})(.+)/g,
            '<span class="c$1">$2</span>');

        return line;
    };
}]);
