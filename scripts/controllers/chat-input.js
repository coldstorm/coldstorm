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

    $scope.autocomplete = function ()
    {
        if ($scope.tab.name)
        {
            elem = document.getElementById("chat-input");

            if ($scope.matches.length > 0)
            {
                elem.value = elem.value.substring(0, $scope.completeIndex) + $scope.matches[$scope.matchIndex].nickName + elem.value.substring($scope.completeIndex + 1);
            }
        }
    };

    $("body").mousedown(function ()
    {
        getSelectedText();
    });

    $("#chat-input").keydown(function (event)
    {
        if (event.which == 9)
        {
            event.preventDefault();
            $scope.autocomplete();
            $scope.matchIndex++;

            if ($scope.matchIndex >= $scope.matches.length)
            {
                $scope.matchIndex = 0;
            }
        }
    });

    $("#chat-input").keyup(function (event)
    {
        if (event.which != 9)
        {
            var val = $(this).val();
            $scope.caret = this.selectionStart;
            $scope.completeIndex = val.lastIndexOf(" ", $scope.caret) + 1;
            $scope.toComplete = val.substring(val.lastIndexOf(" ", $scope.caret) + 1, $scope.caret);
            $scope.completion = $scope.toComplete;
            $scope.matchIndex = 0;
            var users = $scope.tab.users;
            $scope.matches = users.filter(function (element)
            {
                return (element.nickName.toUpperCase().indexOf($scope.toComplete.toUpperCase()) === 0);
            });
        }
    });
}]);