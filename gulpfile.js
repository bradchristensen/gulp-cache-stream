var gulp   = require('gulp'),
	rename = require('gulp-rename'),
	babel  = require('gulp-babel'),
	uglify = require('gulp-uglify');

gulp.task('main', function () {
	return gulp.src('index.js')
		.pipe(babel({ modules: 'common' }))
		.pipe(rename('gulp-cache-stream.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('minify', ['main'], function () {
	return gulp.src('dist/gulp-cache-stream.js')
		.pipe(uglify())
		.pipe(rename('gulp-cache-stream.min.js'))
		.pipe(gulp.dest('dist'));
})

gulp.task('default', ['main', 'minify']);