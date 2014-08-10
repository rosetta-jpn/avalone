var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var bundleLogger = require('../util/bundleLogger');
var handleErrors = require('../util/handleErrors');

gulp.task('browserify', ['clean'], function() {
  function runBundle() {
    bundleLogger.start();
    return browserify('./src/client/boot.js')
      .bundle()
      .on('error', handleErrors)
      .pipe(source('main.js'))
      .pipe(gulp.dest('dist/js'))
      .on('end', bundleLogger.end);
  }

  return runBundle();
});
