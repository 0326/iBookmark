'use strict'

import gulp from 'gulp'

import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'

import jshint from 'gulp-jshint'
import minifyCss from 'gulp-minify-css'
import imagemin from 'gulp-imagemin'
import uglify from 'gulp-uglify'
import less from 'gulp-less'

import concat from 'gulp-concat'
import rename from 'gulp-rename'

gulp.task('scripts',() => {
  return browserify("js/index.js")
    .transform("babelify")
    .bundle()
    .pipe(source("index.js"))
    .pipe(gulp.dest("./build/js"))
    // .pipe(rename({
    //   'suffix':'-min'
    // }))
    // .pipe(uglify())
    // .pipe(gulp.dest('./build/js'))
})


gulp.task('css',() => {
    gulp.src('css/*.less')
        .pipe(less())
        .pipe(gulp.dest('./build/css/'))
        .pipe(minifyCss())
        .pipe(rename({
          'suffix':'-min'
        }))
        .pipe(gulp.dest('./build/css/'))
})

gulp.task('img',() => {
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
})

gulp.task('default',() => {
    gulp.watch('css/*.less', ['css'])
    gulp.watch('js/*.js', ['scripts'])
})
