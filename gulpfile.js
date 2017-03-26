var gulp = require('gulp'),  
    gulpif = require('gulp-if');
    less = require('gulp-less');
    useref = require('gulp-useref');
    minifyCss = require('gulp-minify-css');
    templateCache = require('gulp-angular-templatecache');

gulp.task('less', function () {  
    return gulp
        .src('./app/styles/movie.less')
        .pipe(less())
        .pipe(gulp.dest('./app/styles'));
});

gulp.task('watch-less', function () {  
    gulp.watch('./movies/*.less', ['less'])
        .on('change', function(event) {
            console.log(`Watch: ${event.path} was ${event.type}.`);
        });
});

gulp.task('templates', function() {
    return gulp.src('./app/templates/**/*.html')
                .pipe(templateCache({module: 'MovieModule'}))
                .pipe(gulp.dest('app/scripts'));
});

gulp.task('watch-html', function () {  
    gulp.watch('./app/templates/**/*.html', ['templates'])
        .on('change', function(event) {
            console.log(`Watch: ${event.path} was ${event.type}.`);
        });
});

gulp.task('bundle', function() {
    return gulp.src('./app/index.html')
                .pipe(useref())
                .pipe(gulpif('*.css', minifyCss()))
                .pipe(gulp.dest('build'));
});

gulp.task('default', [ 'less', 'templates', 'bundle'  ]);
gulp.task('dev', ['watch-less', 'watch-html']);