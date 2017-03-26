var MovieListController = function($scope, $mdDialog, MovieListService) {

    $scope.searchText = "";
    $scope.movies = [];
    $scope.spinner = false;

    $scope.searchMovies = function() {
        $scope.spinner = true;
        var search = $scope.searchText.trim().replace(" ", "+");

        if(!!search) {
            MovieListService.getMovies(search).then(function(response) {
                $scope.movies = response;
                $scope.spinner = false;
            });
        }
    };

    $scope.showMovieDetails = function(event, title, imdbId) {
        MovieListService.getMovieDetails(title).then(function(response) {
                $mdDialog.show({
                controller: "MovieDetailController",
                templateUrl: "MovieDetail.html",
                targetEvent: event,
                clickOutsideToClose:true,
                locals : {
                    title : title,
                    imdbId: imdbId,
                    details: response
                }
            });
        });
    };
};

app.controller("MovieListController", MovieListController);