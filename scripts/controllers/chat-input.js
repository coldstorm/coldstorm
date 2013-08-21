Controllers.controller("ChatInputCtrl", ["$scope", "$rootScope", "$window", function ($scope, $rootScope, $window, $document)
{
    var getSelectionText = function ()
    {
        var text = "";
        if ($window.getSelection)
        {
            var elem = document.getElementById("chat-input");
            text = elem.value.substring(elem.selectionStart, elem.selectionEnd)
        } else
        {
            text = document.selection.createRange().text;
        }
        return text;
    };

    $scope.selection = "";

    $scope.submit = function ()
    {
        $rootScope.process($scope.input, $scope.tab);
    };

    $scope.bold = function ()
    {
        if ($scope.selection)
        {
            var startIndex = $scope.input.text.indexOf($scope.selection);
            var endIndex = startIndex + $scope.selection.length + 2;

            $scope.input.text = $scope.input.text.substring(0, startIndex) + "\\b" + $scope.input.text.substring(startIndex, $scope.input.text.length);
            $scope.input.text = $scope.input.text.substring(0, endIndex) + "\\b" + $scope.input.text.substring(endIndex, $scope.input.text.length);
        }
    };

    $scope.underline = function ()
    {
        if ($scope.selection)
        {
            var startIndex = $scope.input.text.indexOf($scope.selection);
            var endIndex = startIndex + $scope.selection.length + 2;

            $scope.input.text = $scope.input.text.substring(0, startIndex) + "\\u" + $scope.input.text.substring(startIndex, $scope.input.text.length);
            $scope.input.text = $scope.input.text.substring(0, endIndex) + "\\u" + $scope.input.text.substring(endIndex, $scope.input.text.length);
        }
    };

    $scope.italicize = function ()
    {
        if ($scope.selection)
        {
            var startIndex = $scope.input.text.indexOf($scope.selection);
            var endIndex = startIndex + $scope.selection.length + 2;

            $scope.input.text = $scope.input.text.substring(0, startIndex) + "\\i" + $scope.input.text.substring(startIndex, $scope.input.text.length);
            $scope.input.text = $scope.input.text.substring(0, endIndex) + "\\i" + $scope.input.text.substring(endIndex, $scope.input.text.length);
        }
    };

    $("body").mousedown(function ()
    {
        $scope.selection = "";
        $scope.selection = getSelectionText();
    });
}]);