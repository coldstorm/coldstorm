Filters.filter("inlineImage", [function ()
{
    return function (input)
    {
        var line = input.replace(/href=\"(.+?).(png|tif|jpg|jpeg|bmp|gif)\"/gi,
            'href="$1.$2" class="inline-image"');

        return line;
    };
}]);

$(document).on("click", ".inline-image", function (evt)
{

    var $this = $(this);

    var chanRegex = /https?:\/\/i\.4cdn\.org\/\w{1,4}\/src\/\d{13}\.(?:jpe?g|png|gif)/i

    if ($this.next().hasClass("inline-image-container"))
    {
        return;
    }

    if (chanRegex.test(this.href))
    {
        return;
    }

    evt.preventDefault();
    evt.stopPropagation();

    var $image = $('<img src="' + this.href + '"/>');
    var $container = $('<div />');

    $container.addClass("inline-image-container");

    $container.click(function (evt) {
        $(this).remove();
    });

    $container.append($image);
    $this.after($container);
});
