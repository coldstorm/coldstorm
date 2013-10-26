Controllers.controller("ChatInputCtrl", ["$scope", "$rootScope", "$window", function ($scope, $rootScope, $window, $document)
{
    $scope.selectionStart = -1;
    $scope.selectionEnd = -1;

    $scope.toComplete = "";
    $scope.caret = -1;
    $scope.completeIndex = -1;
    $scope.matches = [];
    $scope.matchIndex = 0;

    var getSelectedText = function ()
    {
        var elem = document.getElementById("chat-input");
        $scope.selectionStart = elem.selectionStart;
        $scope.selectionEnd = elem.selectionEnd;

        if ($scope.selectionStart === $scope.selectionEnd)
        {
            $scope.selectionStart = -1;
            $scope.selectionEnd = -1;
        }
    };

    var insert = function (orig, location, value)
    {
        return orig.substring(0, location) + value + orig.substring(location, orig.length);
    };

    $scope.submit = function ()
    {
        $rootScope.process($scope.input, $scope.tab);
    };

    $scope.format = function (style)
    {
        if ($scope.selectionStart > -1 && $scope.selectionEnd > -1)
        {
            var startIndex = $scope.selectionStart;
            var endIndex = $scope.selectionEnd + 2;

            $scope.input.text = insert($scope.input.text, startIndex, style);
            $scope.input.text = insert($scope.input.text, endIndex, style);

            $scope.selectionStart += 2;
            $scope.selectionEnd += 2;
        }
    };

    $("body").mousedown(function ()
    {
        getSelectedText();
    });

    var wordStart = 0;
    var wordEnd = 0;

    var autocomplete = function ()
    {
        if ($scope.tab.name)
        {
            elem = document.getElementById("chat-input");

            if ($scope.matches.length > 0)
            {
                var replaceEnd = elem.value.indexOf(" ", wordStart);

                if (replaceEnd === -1)
                {
                    replaceEnd = elem.value.length;
                }

                elem.value = elem.value.substring(0, wordStart) +
                    $scope.matches[$scope.matchIndex].nickName +
                    elem.value.substring(replaceEnd);

                $scope.input.text = elem.value;
            }
        }
    };

    $("#chat-input").bind("keydown", function (event)
    {
        if (event.type == "keydown" && event.which == 9)
        {
            event.preventDefault();
            autocomplete();
            $scope.matchIndex++;

            if ($scope.matchIndex >= $scope.matches.length)
            {
                $scope.matchIndex = 0;
            }
        }
    });

    $("#chat-input").on("keyup click focus", function (event)
    {
        if (event.which != 9)
        {
            var val = $(this).val();

            $scope.caret = this.selectionStart;

            wordStart = val.lastIndexOf(" ", $scope.caret -1) + 1;

            wordEnd = val.indexOf(" ", wordStart);

            if (wordEnd === -1)
            {
                wordEnd = val.length;
            }

            $scope.toComplete = val.substring(wordStart, wordEnd);

            $scope.completion = $scope.toComplete;

            $scope.matchIndex = 0;

            var users = $scope.tab.users;

            $scope.matches = users.filter(function (element)
            {
                var nickName = element.nickName.toUpperCase();

                return nickName.indexOf($scope.toComplete.toUpperCase()) === 0;
            });
        }
    });
}]);
