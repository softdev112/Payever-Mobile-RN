'use strict';

const gulp = require('gulp-task-doc');

gulp.task('help', gulp.help());
gulp.task('default', ['help']);

require('./gulp/bump');
require('./gulp/svg');