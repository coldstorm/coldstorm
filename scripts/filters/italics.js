Filters.filter("italics", [function ()
{
    return function (input)
    {
        if (input)
        {
            var line = input.replace(/\\s/gi, "\u001D");
            var line = input.replace(/\\i/gi, "\u001D");
            line = line.replace(/&#29;/g, "\u001D");
            line = line.replace(/\u001D(.*?)([\n\u000F\u001D]|$)/g,
                '<span class="italics">$1</span>');

            return line;
        } else
        {
            return input;
        }
    }
}]);
