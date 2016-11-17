'use strict';

const { spawn }   = require('child_process');
const gulp        = require('gulp-task-doc');
const ps          = require('ps-node');
const runSequence = require('run-sequence');

gulp.task('start', ['stop'], () => {
  if (process.platform === 'linux') {
    return runSequence('start:android');
  } else {
    return runSequence('start:ios');
  }
});

gulp.task('stop', (done) => {
  const options = {
    command: 'node',
    psargs: 'ux',
    arguments: 'react-native'
  };
  ps.lookup(options, (err, results) => {
    results.forEach(p => process.kill(p.pid));
    done();
  });
});


gulp.task('start:dev-server', () => {
  spawn('./node_modules/.bin/react-native', ['start'], {
    stdio: 'inherit'
  });
});