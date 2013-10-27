Filters.filter("ctcpAction", [function ()
{
    return function (input)
    {
        var line = input;

        line = line.replace(/&#1;/g, "\u0001");

        line = line.replace(/\u0001ACTION (.+?)\u0001/g,
            '<span class="italics">$1</span>');

        return line;
    };
}]);
