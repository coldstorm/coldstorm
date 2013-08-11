Filters.filter("highlight", ["User", function (User)
{
    return function (input)
    {
        var user = User.get("~");
        var line = input.replace(user.nickName, '<span class="highlight">' +
            user.nickName + '</span>');

        return line;
    };
}]);
