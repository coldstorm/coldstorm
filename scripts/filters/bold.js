Filters.filter("bold", [function ()
{
    return function (input)
    {
        if (input)
        {
            var line = input.replace(/\\b/gi, "\u0002");
            line = line.replace(/&#2;/g, "\u0002");
            line = line.replace(/\u0002(.*?)([\n\u000F\u0002]|$)/g,
                '<span class="bold">$1</span>');

            return line;
        } else
        {
            return input;
        }
    }
}]);
