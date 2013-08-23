Filters.filter("sortUsers", [function () {
    return function (input, channel)
    {
        if (input)
        {
            var users = input.sort(function (a, b)
            {
                var ranks = ["", "+", "%", "@"];

                if (a.ranks[channel.name] === undefined)
                {
                    a.ranks[channel.name] = "";
                }

                if (b.ranks[channel.name] === undefined)
                {
                    b.ranks[channel.name] = "";
                }

                if (a.ranks[channel.name].charAt(0) != b.ranks[channel.name].charAt(0))
                {
                    if (ranks.indexOf(a.ranks[channel.name].charAt(0)) > ranks.indexOf(b.ranks[channel.name].charAt(0)))
                    {
                        return -1;
                    }

                    return 1;
                }

                return a.nickName.localeCompare(b.nickName);
            });

            return users;
        } else
        {
            return input;
        }
    };
}]);
