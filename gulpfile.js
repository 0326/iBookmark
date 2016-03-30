var gulp = require('gulp')

var minifyCss = require('gulp-minify-css')   //css压缩
var concat = require('gulp-concat')            //js合并
var jshint = require('gulp-jshint')            //js规范验证
var uglify = require('gulp-uglify')            //js压缩
var less = require('gulp-less')                // less编译
var rename = require('gulp-rename')           //文件名命名
var imagemin = require('gulp-imagemin')      //图片压缩


gulp.task('css', function () {
    gulp.src('css/*.less')
        .pipe(less())
        .pipe(gulp.dest('./build/css/'))
        .pipe(minifyCss())
        .pipe(rename({
          'suffix':'-min'
        }))
        .pipe(gulp.dest('./build/css/'))
})

gulp.task('scripts', function () {
    gulp.src('js/*.js')
        // .pipe(concat('ibookmark.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(rename({
          'suffix':'-min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
})

gulp.task('img', function () {
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
})

gulp.task('default', function () {
    gulp.watch('css/*.less', ['css'])
    gulp.watch('js/*.js', ['scripts'])

})
