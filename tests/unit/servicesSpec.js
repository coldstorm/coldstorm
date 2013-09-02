describe("Coldstorm services", function ()
{
    beforeEach(angular.mock.module("coldstorm.services"));

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
        });

        it("should add a line with an author when calling addLine(message, author)",
            inject(["User", function (User)
            {
                var channel = $Channel.register("test");

                channel.addLine("test", User.register("testAuthor"));

                expect(channel.lines[0].author.nickName).toBe("testAuthor");
            }]));

        it("should add a user when calling addUser(user)",
            inject(["User", function (User)
            {
                var channel = $Channel.register("test");

                channel.addUser(User.register("testUser"));

                expect(channel.users.length).toBe(1);
                expect(channel.users[0].nickName).toBe("testUser");
            }]));

        it("should clear the lines when calling clear()", function ()
        {
            var channel = $Channel.register("test");

            channel.addLine("test");

            expect(channel.lines.length).toBe(1);

            channel.clear();

            expect(channel.lines.length).toBe(0);
        });
    });
});