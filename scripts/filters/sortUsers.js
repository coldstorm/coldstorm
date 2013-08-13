Filters.filter("sortUsers", [function () {
    return function (input, channel)
    {
        if (input)
        {
            var users = input.sort(function (a, b)
            {
                var ranks = ["", "+", "%", "@"];

                if (a.ranks[channel.name] != b.ranks[channel.name])
                {
                    if (ranks.indexOf(a.ranks[channel.name]) > ranks.indexOf(b.ranks[channel.name]))
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
