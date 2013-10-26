Filters.filter("inlineImage", [function ()
{
    return function (input)
    {
        var line = input.replace(/href=\"(.+?).(png|tif|jpg|jpeg|bmp|gif)\"/i,
            'href="$1.$2" class="inline-image"');

        return line;
    };
}]);

$(document).on("click", ".inline-image", function (evt)
{

    var $this = $(this);

    if ($this.next().hasClass("inline-image-container") === false)
    {
        evt.preventDefault();
        evt.stopPropagation();

        var $image = $('<img src="' + this.href + '"/>');
        var $container = $('<div />');
        $container.addClass("inline-image-container");

        $container.click(function (evt)
        {
            $(this).remove();
        });

        $container.append($image);
        $this.after($container);
    } else
    {

    }
});
