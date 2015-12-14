'use strict';

const gulp      = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass        = require('gulp-sass'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat');

var styleGlob = 'app/sass/**/*.scss',
    progGlob = 'app/js/*.js',
    markupGlob = 'app/*.html';

// Serve in development by default
gulp.task('default', ['serve']);

// Build js
gulp.task('js', function () {
    return gulp.src(progGlob)
               .pipe(uglify())
               .pipe(gulp.dest('_build/js'))
               .pipe(browserSync.stream())
});

// Build sass->css
gulp.task('sass', function () {
    return gulp.src(styleGlob)
               .pipe(sass().on('error', sass.logError))
               .pipe(concat('site.css'))
               .pipe(gulp.dest('_build/css'))
               .pipe(rename({ extname: '.min.css' }))
               .pipe(minifyCSS())
               .pipe(gulp.dest('_build/css'))
});

// Build html
gulp.task('html', function () {
    return gulp.src(markupGlob)
               .pipe(gulp.dest('_build/'))
});

// Build js & sass
gulp.task('build', ['sass', 'js', 'html']);

// Serve via browserSync
gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: './_build'
        }
    });

    gulp.watch(styleGlob, ['sass', browserSync.reload]);
    gulp.watch(progGlob, ['js']);
    gulp.watch('_build/*.html').on('change', browserSync.reload);

});
