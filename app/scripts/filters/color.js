Filters.filter("color", [function ()
{
    return function (input)
    {
        if (input)
        {
            var line = input.replace(/\\c/gi, "\u0003");
            line = line.replace(/&#3;/g, "\u0003");

            line = line.replace(/\u0003([0-9]{1,2}),([0-9]{1,2})([^\n\u000F\u0003]*)/g,
                function (match, p1, p2, p3, offset, string)
                {
                    if (parseInt(p1) === 1 && parseInt(p2) === 1)
                    {
                        return '<span class="spoiler">' + p3 + '</span>';
                    } else
                    {
                        return '<span class="c' + p1 + ' bc' + p2 + '">' + p3 + '</span>';
                    }
                });
            line = line.replace(/\u0003,([0-9]{1,2})([^\n\u000F\u0003]*)/g,
                '<span class="bc$1">$2</span>');
            line = line.replace(/\u0003([0-9]{1,2})([^\n\u000F\u0003]*)/g,
                '<span class="c$1">$2</span>');

            return line;
        } else
        {
            return input;
        }
    };
}]);
'<span class="c$1 bc$2">$3</span>'