Filters.filter("reset", function ()
{
    return function (input)
    {
        if (input)
        {
            var line = input.replace(/\\o/gi, "\u000F");
            return line;
        } else
        {
            return input;
        }
    }
});