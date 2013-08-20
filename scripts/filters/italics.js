Filters.filter("italics", [function ()
{
    return function (input)
    {
        if (input)
        {
            var line = input.replace(/&#29;/g, "\u001D");
            line = line.replace(/\u001D(.*?)[\n\u000F\u001D]/g,
                '<span class="italics">$1</span>');

            return line;
        } else
        {
            return input;
        }
    }
}]);
