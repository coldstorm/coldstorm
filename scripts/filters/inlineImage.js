Filters.filter("inlineImage", [function ()
{
    return function (input)
    {
        var line = input.replace(/href=\"(.+?).(png|tif|jpg|jpeg|bmp|gif)\"/,
            'href="$1.$2" class="inline-image"');

        return line;
    };
}]);

$(document).on("click", ".inline-image", function (evt)
{
    evt.preventDefault();
    evt.stopPropagation();

    var $this = $(this);

    var $image = $('<img src="' + this.href + '"/>');
    var $container = $('<div />');
    $container.addClass("inline-image-container");

    $container.click(function (evt)
    {
        $(this).remove();
    });

    $container.append($image);
    $this.after($container);
});
