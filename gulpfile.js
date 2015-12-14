'use strict';

const gulp       = require('gulp'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass'),
    minifyCSS    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    htmlRenderer = require('gulp-nunjucks-render'),
    // data         = require('gulp-data'),
    // fm           = require('front-matter'),
    // marked       = require('marked'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat');

var styleGlob    = 'app/sass/**/*.scss',
    progGlob     = 'app/js/*.js',
    htmlGlob   = 'app/**/*.html',
    markdownGlob = 'app/**/*.md';

marked.setOptions({
    gfm: true,
    tables: true
})

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
    htmlRenderer.nunjucks.configure(['app/'], {watch: false});

    return gulp.src([htmlGlob, '!app/base.html'])
               .pipe(htmlRenderer())
               .pipe(gulp.dest('_build/'))
});

/*
// Build markdown
gulp.task('markdown', function () {
    htmlRenderer.nunjucks.configure(['app/'], {watch: false});

    return gulp.src(markdownGlob)
        .pipe(data(function (file) {
            var content = fm(String(file.contents));
            file.contents = new Buffer(marked(content.body));
            return content.attributes;
        }))
        .pipe(htmlRenderer())
        .pipe(gulp.dest('_build/'));
});
*/

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
    gulp.watch(htmlGlob, ['html', browserSync.reload]);
    // gulp.watch(markdownGlob, ['markdown', browserSync.reload]);
});
