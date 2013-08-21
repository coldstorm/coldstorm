Controllers.controller("ChatInputCtrl", ["$scope", "$rootScope", "$window", function ($scope, $rootScope, $window, $document)
{
    $scope.selectionStart = -1;
    $scope.selectionEnd = -1;

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
}]);