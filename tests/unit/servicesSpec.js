describe("Coldstorm services", function ()
{
    beforeEach(module("coldstorm.services"));

    describe("Channel", function ()
    {
        var $Channel;

        beforeEach(inject(["Channel", function (Channel)
        {
            $Channel = Channel;
        }]));

        it("should return a channel object when calling register(name)", function ()
        {
            var channel = $Channel.register("test");
            expect(channel.name).toBe("test");
        });

        it("should return a list of all channels when calling all()", function ()
        {
            $Channel.register("test");
            $Channel.register("test2");

            expect($Channel.all().length).toBe(2);
        });

        it("should return the correct channel when calling get()", function ()
        {
            $Channel.register("test");

            var channel = $Channel.get("test");

            expect(channel.name).not.toBe(undefined);
        });

        it("should add a line when calling addLine(message)", function ()
        {
            var channel = $Channel.register("test");

            channel.addLine("test");

            expect(channel.lines.length).toBe(1);
            expect(channel.lines[0].message).toBe("test");
            expect(channel.lines[0].systemMessage).toBe(true);
        });

        it("should add a line with an author when calling addLine(message, author)",
            inject(["User", function (User)
            {
                var channel = $Channel.register("test");

                channel.addLine("test", User.register("testAuthor"));

                expect(channel.lines[0].author.nickName).toBe("testAuthor");
                expect(channel.lines[0].message).toBe("test");
                expect(channel.lines[0].systemMessage).toBe(false);
            }]));

        it("should add a user when calling addUser(user)",
            inject(["User", function (User)
            {
                var channel = $Channel.register("test");

                channel.addUser(User.register("testUser"));

                expect(channel.users.length).toBe(1);
                expect(channel.users[0].nickName).toBe("testUser");
            }]));

        it("should delete the channel object when calling leave()", function ()
        {
            var channel = $Channel.register("test");

            channel.leave();

            channel = $Channel.get("test");

            expect(channel).toBe(undefined);
        });

        it("should clear the lines when calling clear()", function ()
        {
            var channel = $Channel.register("test");

            channel.addLine("test");

            expect(channel.lines.length).toBe(1);

            channel.clear();

            expect(channel.lines.length).toBe(0);
        });
    });

    describe("Query", function ()
    {
        var $Query;

        beforeEach(inject(["Query", function (Query)
        {
            $Query = Query;
        }]));

        it("should return a query object when calling register(name)", function ()
        {
            var query = $Query.register("test");

            expect(query.name).toBe("test");
        });

        it("should return all queries when calling all()", function ()
        {
            $Query.register("test");
            $Query.register("test2");

            expect($Query.all().length).toBe(2);
        });

        it("should return the correct query when calling get(name)", function ()
        {
            $Query.register("test");

            var query = $Query.get("test");

            expect(query.name).toBe("test");
        });

        it("should add a line when calling addLine(message)", function ()
        {
            var query = $Query.register("test");

            query.addLine("test");

            expect(query.lines.length).toBe(1);
            expect(query.lines[0].message).toBe("test");
            expect(query.lines[0].systemMessage).toBe(true);
        });

        it("should add a line with an author when calling addLine(message, author)",
            inject(["User", function (User)
            {
                var query = $Query.register("test");

                query.addLine("test", User.register("testAuthor"));

                expect(query.lines[0].author.nickName).toBe("testAuthor");
                expect(query.lines[0].message).toBe("test");
                expect(query.lines[0].systemMessage).toBe(false);
            }]));

        it("should delete the query object when calling close()", function ()
        {
            var query = $Query.register("test");

            query.close();

            query = $Query.get("test");

            expect(query).toBe(undefined);
        });

        it("should clear the lines when calling clear()", function ()
        {
            var query = $Query.register("test");

            query.addLine("test");

            expect(query.lines.length).toBe(1);

            query.clear();

            expect(query.lines.length).toBe(0);
        });
    });

    describe("Server", function ()
    {
        var $Server;
        beforeEach(inject(["Server", function (Server)
        {
            $Server = Server;
        }]));

        it("should add a line when calling addLine(message)", function ()
        {
            $Server.addLine("test");

            expect($Server.lines.length).toBe(1);
            expect($Server.lines[0].message).toBe("test");
            expect($Server.lines[0].systemMessage).toBe(true);
        });

        it("should add a line with an author when calling addLine(message, author)",
            inject(["User", function (User)
            {
                $Server.addLine("test", User.register("testAuthor"));

                expect($Server.lines[0].author.nickName).toBe("testAuthor");
                expect($Server.lines[0].message).toBe("test");
                expect($Server.lines[0].systemMessage).toBe(false);
            }]));

        it("should clear the lines when calling clear()", function ()
        {
            $Server.addLine("test");

            expect($Server.lines.length).toBe(1);

            $Server.clear();

            expect($Server.lines.length).toBe(0);
        });
    });

    describe("Settings", function ()
    {
        var $Settings;
        beforeEach(inject(["Settings", function (Settings)
        {
            $Settings = Settings;
        }]));

        it("should set the settings cookie when calling save()", function ()
        {
            $Settings.save();

            expect($.cookie("settings")).not.toBe(undefined);

            $.removeCookie("settings");
        });
    });

    describe("User", function ()
    {
        var $User;
        beforeEach(inject(["User", function (User)
        {
            $User = User;
        }]));

        it("should return a user object when calling register(name)", function ()
        {
            var user = $User.register("test");

            expect(user.nickName).toBe("test");
        });

        it("should move a user object correctly when calling move(oldName, newName)", function ()
        {
            var user = $User.register("test", "#FFFFFF");

            $User.move("test", "test2");

            var user2 = $User.get("test2");

            expect(user2.color).toBe("#FFFFFF");
        });

        it("should alias a user correctly when calling alias(first, second)", function ()
        {
            var user = $User.register("test", "#FFFFFF");

            $User.alias("test2", "test");

            expect($User.get("test2").color).toBe("#FFFFFF");
        });

        it("should sort the ranks correctly when calling addRank(channel, rank)",
            inject(["Channel", function (Channel)
            {
                var user = $User.register("test");
                var testChannel = Channel.register("testChannel");

                user.addRank(testChannel, "%");

                expect(user.ranks[testChannel.name]).toBe("%");

                user.addRank(testChannel, "+");

                expect(user.ranks[testChannel.name]).toBe("%+");

                user.addRank(testChannel, "@");

                expect(user.ranks[testChannel.name]).toBe("@%+");
            }]));

        it("should remove the ranks correctly when calling removeRank(channel, rank)",
            inject(["Channel", function (Channel)
            {
                var user = $User.register("test");
                var testChannel = Channel.register("testChannel");

                user.addRank(testChannel, "@");
                user.addRank(testChannel, "%");
                user.addRank(testChannel, "+");

                expect(user.ranks[testChannel.name]).toBe("@%+");

                user.removeRank(testChannel, "%");

                expect(user.ranks[testChannel.name]).toBe("@+");
            }]));
    });

    describe("YouTube", function ()
    {
        var $YouTube;
        beforeEach(inject(["YouTube", function (YouTube)
        {
            $YouTube = YouTube;
        }]));

        it("should return a YouTube object when calling register(id)", function ()
        {
            var youtube = $YouTube.register("test")

            expect(youtube.id).toBe("test")
        });

        it("should return all YouTube objects when calling all()", function ()
        {
            $YouTube.register("test");
            $YouTube.register("test2");

            var youtubes = $YouTube.all();

            expect(youtubes.length).toBe(2);
        });

        it("should return the correct YouTube object when calling get(id)", function ()
        {
            $YouTube.register("test");

            var youtube = $YouTube.get("test");

            expect(youtube.id).toBe("test");
        });

        it("should delete the YouTube object when calling close()", function ()
        {
            $YouTube.register("test");

            var youtube = $YouTube.get("test").close();

            expect(youtube).toBe(undefined);
        });
    });
});