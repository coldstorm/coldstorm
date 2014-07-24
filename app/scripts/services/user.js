Services.factory("User", ["$rootScope", function ($rootScope)
{
    var currentUser = "";

    var registry = {};

    return {
        register: function (name, color, country, flag)
        {
            if (name == null)
            {
                throw "Undefined name";
            }

            registry[name] = {
                color: color != null ? color : "#BABBBF",
                country: country != null ? country : "Unknown",
                flag: flag != null ? flag : "QQ",
                nickName: name,
                userName: null,
                hostName: null,
                awayMsg: null,
                ranks: [],
                channels: [],
                addChannel: function (channel)
                {
                    if (this.channels.indexOf(channel.name) == -1)
                    {
                        this.channels.push(channel.name);
                    }
                },

                removeChannel: function (name)
                {
                    var index = this.channels.indexOf(name);

                    if (index !== -1)
                    {
                        this.channels.splice(index, 1);
                    }
                },

                addRank: function (channelName, rank)
                {
                    if (channelName in this.ranks)
                    {
                        if (this.ranks[channelName].indexOf(rank) == -1 &&
                            "+%@&~".indexOf(rank) != -1)
                        {
                            this.ranks[channelName] += rank;
                        }
                    } 

                    else
                    {
                        if ("+%@&~".indexOf(rank) != -1)
                        {
                            this.ranks[channelName] = rank;
                        }
                    }

                    var tempRanks = [];
                    for (var i = 0; i < this.ranks[channelName].length; i++)
                    {
                        tempRanks.push(this.ranks[channelName][i]);
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
                            case '&': firstRank = 4;
                                break;
                            case '~': firstRank = 5;
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
                            case '&': firstRank = 4;
                                break;
                            case '~': firstRank = 5;
                                break;
                        }

                        if (firstRank > secondRank)
                            return -1;
                        if (firstRank < secondRank)
                            return 1;
                        return 0;
                    });

                    var user = this;
                    $rootScope.$apply(function ()
                    {
                        user.ranks[channelName] = tempRanks.join("");
                    });
                },

                removeRank: function (channelName, rank)
                {
                    if (this.ranks[channelName].indexOf(rank) != -1 && "+%@&~".indexOf(rank) != -1)
                    {
                        this.ranks[channelName] = this.ranks[channelName].replace(rank, '');
                    }
                }, 

                delete: function ()
                {
                    delete registry[this.nickName];
                }
            };

            if (name == "~")
            {
                registry[name].nickName = "";
            }

            return registry[name];
        },

        get: function (name)
        {
            if (name in registry)
            {
                return registry[name];
            } 

            else
            {
                return this.register(name);
            }
        },

        set: function (oldName, newName)
        {
            if (oldName in registry && oldName !== newName)
            {
                registry[newName] = registry[oldName];

                for (var channel in registry[newName].channels)
                {
                    channel.users[newName] = channel.users[oldName];
                    delete channel.users[oldName];
                }

                delete registry[oldName];
            }
        },

        alias: function (first, second)
        {
            registry[first] = registry[second];
        }, 

        delete: function (name)
        {
            delete registry[name];
        }
    };
}]);
