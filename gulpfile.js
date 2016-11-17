'use strict';

const { spawn, spawnSync } = require('child_process');
const gulp  = require('gulp-task-doc');


gulp.task('help', gulp.help());
gulp.task('default', ['help']);

require('./gulp/main');
require('./gulp/android');
require('./gulp/ios');