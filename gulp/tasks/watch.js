var gulp = require('gulp');
var paths = {
  scripts: ['src/client/**/*.js', 'src/models/client/**/*.js', 'test/**/*.js'],
}

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['browserify']);
});
