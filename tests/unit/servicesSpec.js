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
});