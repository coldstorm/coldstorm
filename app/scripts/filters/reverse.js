Filters.filter("reverse", function ()
{
    return function (items)
    {
        if (items)
        {
            return items.slice().reverse();
        }
    }
});