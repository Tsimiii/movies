var app = angular.module("MovieModule", ["ngRoute", "ngMaterial"]);

app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "MovieList.html",
        controller: "MovieListController"
    });
});
angular.module('MovieModule').run(['$templateCache', function($templateCache) {$templateCache.put('MovieDetail.html','<md-dialog aria-label={{title}}>\r\n    <form ng-cloak>\r\n      <md-toolbar>\r\n        <div class="md-toolbar-tools">\r\n          <h2>{{title}}</h2>\r\n          <span flex></span>\r\n          <md-button class="md-icon-button" ng-click="cancel()">\r\n            <i class="material-icons">close</i>\r\n          </md-button>\r\n        </div>\r\n      </md-toolbar>\r\n\r\n      <md-dialog-content>\r\n        <div class="md-dialog-content">\r\n          <p ng-repeat="section in details">\r\n          {{section}}\r\n          </div>\r\n      </md-dialog-content>\r\n\r\n      <md-dialog-actions layout="row">\r\n        <md-button href="http://www.imdb.com/title/{{imdbId}}" target="_blank">\r\n          More on IMDB\r\n        </md-button>\r\n        <md-button href="http://en.wikipedia.org/wiki/{{title}}" target="_blank">\r\n          More on Wikipedia\r\n        </md-button>\r\n        <span flex></span>\r\n      </md-dialog-actions>\r\n    </form>\r\n</md-dialog>');
$templateCache.put('MovieList.html','<div>\r\n    <div class="header">\r\n        <div class="search">\r\n            <md-input-container md-no-float>\r\n                <md-button class="md-icon-button search-button" ng-click="searchMovies()">\r\n                    <i class="material-icons search-icon">search</i>\r\n                </md-button>\r\n                <input type="text" placeholder="Search movie" ng-model="searchText" ng-keyup="$event.keyCode == 13 ? searchMovies() : null">\r\n\r\n            </md-input-container>\r\n            <button class="md-raised md-primary md-button" type="button" ng-click="searchMovies()">Search\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div class="card-container">\r\n        <div ng-show="spinner" layout="row" layout-sm="column" layout-align="space-around" class="spinner">\r\n            <md-progress-circular md-mode="indeterminate" [color]="black"></md-progress-circular>\r\n        </div>\r\n        <md-card ng-hide="spinner" ng-repeat="movie in movies">\r\n            <md-card-title>\r\n                <md-card-title-text>\r\n                    <span class="md-headline" ng-click="showMovieDetails($event, movie.Title, movie.imdbID)">{{ movie.Title }}</span>\r\n                    <span class="md-subhead">{{ movie.Type }}</span>\r\n                    <span class="md-subhead">{{ movie.Year }}</span>\r\n                </md-card-title-text>\r\n                <md-card-title-media>\r\n                    <img ng-src="{{movie.Poster}}" class="md-media-lg" alt="{{movie.imdbID}}" />\r\n                </md-card-title-media>\r\n            </md-card-title>\r\n        </md-card>\r\n    </div>\r\n</div>');}]);
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
var MovieDetailController = function($scope, $mdDialog, title, imdbId, details) {
    $scope.title = title;
    $scope.imdbId = imdbId;
    $scope.details = details ? details.split("\n") : ["Wikipedia does not have an article with this exact name."];

    $scope.cancel = function() {
        $mdDialog.hide();
    };

    console.log(title);
    console.log(details);
};

app.controller("MovieDetailController", MovieDetailController);
MovieDetailController.$inject = ["$scope", "$mdDialog", "title", "imdbId", "details"];

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