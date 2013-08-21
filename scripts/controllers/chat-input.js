Controllers.controller("ChatInputCtrl", ["$scope", "$rootScope", "$window", function ($scope, $rootScope, $window, $document)
{
    var getSelectedText = function ()
    {
        var elem = document.getElementById("chat-input");
        $scope.selectionStart = elem.selectionStart;
        $scope.selectionEnd = elem.selectionEnd;
    };

    $scope.selectionStart;
    $scope.selectionEnd;

    $scope.submit = function ()
    {
        $rootScope.process($scope.input, $scope.tab);
    };

    $scope.bold = function ()
    {
        if ($scope.selectionStart > -1 && $scope.selectionEnd > -1)
        {
            var startIndex = $scope.selectionStart;
            var endIndex = $scope.selectionEnd + 2;

            $scope.input.text = $scope.input.text.substring(0, startIndex) + "\\b" + $scope.input.text.substring(startIndex, $scope.input.text.length);
            $scope.input.text = $scope.input.text.substring(0, endIndex) + "\\b" + $scope.input.text.substring(endIndex, $scope.input.text.length);

            $scope.selectionStart += 2;
            $scope.selectionEnd += 2;
        }
    };

    $scope.underline = function ()
    {
        if ($scope.selectionStart > -1 && $scope.selectionEnd > -1)
        {
            var startIndex = $scope.selectionStart;
            var endIndex = $scope.selectionEnd + 2;

            $scope.input.text = $scope.input.text.substring(0, startIndex) + "\\u" + $scope.input.text.substring(startIndex, $scope.input.text.length);
            $scope.input.text = $scope.input.text.substring(0, endIndex) + "\\u" + $scope.input.text.substring(endIndex, $scope.input.text.length);

            $scope.selectionStart += 2;
            $scope.selectionEnd += 2;
        }
    };

    $scope.italicize = function ()
    {
        if ($scope.selectionStart > -1 && $scope.selectionEnd > -1)
        {
            var startIndex = $scope.selectionStart;
            var endIndex = $scope.selectionEnd + 2;

            $scope.input.text = $scope.input.text.substring(0, startIndex) + "\\i" + $scope.input.text.substring(startIndex, $scope.input.text.length);
            $scope.input.text = $scope.input.text.substring(0, endIndex) + "\\i" + $scope.input.text.substring(endIndex, $scope.input.text.length);

            $scope.selectionStart += 2;
            $scope.selectionEnd += 2;
        }
    };

    $("body").mousedown(function ()
    {
        $scope.selectionStart = -1;
        $scope.selectionEnd = -1;
        getSelectedText();
    });
}]);