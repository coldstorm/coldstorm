Filters.filter("highlight", ["User", function (User)
{
    return function (input)
    {
        var user = User.get("~");
        //(\ test\ )|(^test\ +)|(^\ ?test\ ?$)|(\ test\ ?$)
        var re = new RegExp("(\ " + user.nickName +
            "\ )|(^" + user.nickName +
            "\ +)|(^\ ?" + user.nickName +
            "\ ?$)|(\ " + user.nickName + 
            "\ ?$)", "ig");
        var matches = input.match(re);

        if (matches != null)
        {
            var line = input.replace(matches[0], '<span class="highlight">' +
                matches[0] + '</span>');

            return line;
        }
        return input;
    };
}]);
