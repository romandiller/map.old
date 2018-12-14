const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const imagemin = require("gulp-imagemin");

gulp.task('css', () => {
    gulp
        .src('public/stylesheets/*.css')
        .pipe(plumber())
        .pipe(cssnano())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('public/production/stylesheets'));
});

gulp.task('image', () => {

	gulp
		.src('public/images/**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest('public/production/images'));

});

gulp.task('default', ['css', 'image']);