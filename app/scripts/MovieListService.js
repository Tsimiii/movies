var MovieListService = function($http) {

    var omdbApiUrl = "http://www.omdbapi.com/?s=";
    var wikiApiUrl = "https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro=&explaintext=&titles=";

    var getMovies = function(searchText) {

        return $http.get(omdbApiUrl + searchText)
                    .then(function(response) {
                        return response.data.Search;
                    });
    };

    var getMovieDetails = function(title) {
        return $http.get(wikiApiUrl + title)
                    .then(function(response) {
                        var pages = response.data.query.pages;
                        var keys = Object.keys(pages);
                        return pages[keys[0]].extract;
                    });
    }

    return {
        getMovies: getMovies,
        getMovieDetails: getMovieDetails
    };
};

app.factory("MovieListService", MovieListService);