Filters.filter("highlight", ["User", function (User)
{
    return function (input)
    {
        var user = User.get("~");
        var re = new RegExp( "\\b(" + user.nickName + ")\\b", "ig" );
	return input.replace( re, '<span class="highlight">$1</span>' );
    };
}]);
