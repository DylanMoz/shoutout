var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


function _minifyJs (path) {
  return gulp.src([path + '/**/*.js', '!' + path + '/module.js'])
    .pipe(concat('module.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(path+'/'));
}

gulp.task('js', function() {
  _minifyJs('./public/js/organization');
  _minifyJs('./public/js/employee');
  _minifyJs('./public/js/shared');
});

gulp.task('watch', function() {
  gulp.watch([
    './public/**/*.js',
    '!./public/js/**/module.js'
  ], ['build']);
});

gulp.task('build', ['js']);

gulp.task('default', ['build']);
