var MovieDetailController = function($scope, $mdDialog, title, imdbId, details) {
    $scope.title = title;
    $scope.imdbId = imdbId;
    $scope.details = details ? details.split("\n") : ["Wikipedia does not have an article with this exact name."];

    $scope.cancel = function() {
        $mdDialog.hide();
    };
};

app.controller("MovieDetailController", MovieDetailController);
MovieDetailController.$inject = ["$scope", "$mdDialog", "title", "imdbId", "details"];
