Filters.filter("line", ["$filter", function ($filter)
{
    return function (input)
    {
        var line = input;
        var yt_regex = /<a target="_blank" href="http:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)(\w*)(&(amp;)?[\w\?=]*)?"/;

        line = $filter("linky")(line);

        line = line.replace("<a href", '<a target="_blank" href');

        line = line.replace(yt_regex, '<a href="#/yt/$1"');

        line = $filter("ctcpAction")(line);
        line = $filter("spoiler")(line);
        line = $filter("highlight")(line);
        line = $filter("inlineImage")(line);
        line = $filter("reset")(line);
        line = $filter("color")(line);
        line = $filter("bold")(line);
        line = $filter("underline")(line);
        line = $filter("italics")(line);

        return line;
    };
}]);
