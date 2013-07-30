Services.provider("User", function ()
{
    var currentUser = "";

    var registry = {};

    this.$get = function ()
    {
        var provider = {};

        provider.register = function (name, color, country, flag)
        {
            registry[name] = {
                color: color != null ? color : "#BABBBF",
                country: country != null ? country : "Outlaw",
                flag: flag != null ? flag : "QQ",
                nickName: name,
                ranks: [],
                addRank: function (channel, rank)
                {
                    if (this.ranks[channel.name].indexOf(rank) == -1 && "+%@".indexOf(rank) != -1)
                    {
                        this.ranks[channel.name] += rank;
                    }

                    var tempRanks = [];
                    for (var i = 0; i < this.ranks[channel.name].length; i++)
                    {
                        tempRanks.push(this.ranks[channel.name][i]);
                    }

                    tempRanks.sort(function (a, b)
                    {
                        var firstRank, secondRank;
                        switch (a)
                        {
                            case '+': firstRank = 1;
                                break;
                            case '%': firstRank = 2;
                                break;
                            case '@': firstRank = 3;
                                break;
                        }

                        switch (b)
                        {
                            case '+': secondRank = 1;
                                break;
                            case '%': secondRank = 2;
                                break;
                            case '@': secondRank = 3;
                                break;
                        }

                        if (firstRank > secondRank)
                            return -1;
                        if (firstRank < secondRank)
                            return 1;
                        return 0;
                    });

                    this.ranks[channel.name] = tempRanks.join("");
                },

                removeRank: function (channel, rank)
                {
                    if (this.ranks[channel.name].indexOf(rank) != -1 && "+%@".indexOf(rank) != -1)
                    {
                        this.ranks[channel.name] = this.ranks[channel.name].replace(rank, '');
                    }
                }
            };

            if (name == "~")
            {
                registry[name].nickName = "";
            }

            return registry[name];
        };

        provider.get = function (name)
        {
            if (name in registry)
            {
                return registry[name];
            } else
            {
                return provider.register(name);
            }
        };

        provider.move = function (oldName, newName)
        {
            if (oldName in registry)
            {
                registry[newName] = registry[oldName];

                delete registry[oldName];
            }
        };

        return provider;
    };
});
