Filters.filter("highlight", ["User", function (User)
{
    return function (input)
    {
        var user = User.get("~");
        var re = new RegExp( "([^\\w\\d]|^)(" + user.nickName + ")(\\s?" + user.nickName + ")*([^\\w\\d]|$)", "ig" );
	return input.replace( re, '$1<span class="highlight">$2</span>$3' );
    };
}]);
