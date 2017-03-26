var app = angular.module("MovieModule", ["ngRoute", "ngMaterial"]);

app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "MovieList.html",
        controller: "MovieListController"
    });
});