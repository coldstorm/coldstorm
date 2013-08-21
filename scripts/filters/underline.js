Filters.filter("underline", [function ()
{
    return function (input)
    {
        if (input)
        {
            var line = input.replace(/\\u/gi, "\u001F");
            line = line.replace(/&#31;/g, "\u001F");
            line = line.replace(/\u001F(.*?)([\n\u000F\u001F]|$)/g,
                '<span class="underlined">$1</span>');

            return line;
        } else
        {
            return input;
        }
    }
}]);
