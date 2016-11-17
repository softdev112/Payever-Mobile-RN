'use strict';

const { spawn }   = require('child_process');
const gulp        = require('gulp-task-doc');
const ps          = require('ps-node');
const runSequence = require('run-sequence');


gulp.task('start:ios', [
  //'start:android-emulator',
  'start:ios-deploy',
  'start:dev-server',
  //'start:android-log'
]);

gulp.task('start:ios-deploy', () => {
  spawn('./node_modules/.bin/react-native', ['run-ios'], {
    stdio: 'inherit'
  });
});