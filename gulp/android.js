'use strict';

const { spawn }   = require('child_process');
const gulp        = require('gulp-task-doc');
const ps          = require('ps-node');
const runSequence = require('run-sequence');


gulp.task('start:android', [
  'start:android-emulator',
  'start:android-deploy',
  'start:dev-server',
  'start:android-log'
]);

gulp.task('start:android-deploy', () => {
  spawn('./node_modules/.bin/react-native', ['run-android'], {
    stdio: 'inherit'
  });
});

gulp.task('start:android-log', () => {
  spawn('react-native', ['log-android'], { stdio: 'inherit' });
  /*const adb  = spawn('adb',   ['logcat']);
  adb.stdout.on('data', (data) => {
    data
      .toString('utf8')
      .split('\n')
      .forEach((line) => {
        const lower = line.toLowerCase();
        if (line.indexOf('unknown:ViewManagerPropertyUpdater') !== -1) {
          return;
        }
        if (
          lower.indexOf('payever') !== -1 ||
          lower.indexOf('react')  !== -1 ||
          lower.indexOf('fb-')     !== -1 ||
          lower.indexOf('facebook') !== -1
        ) {
          console.log(line);
        }
      });
  });*/
});

gulp.task('start:android-emulator', () => {
  isEmulatorWorking((isRun) => {
    if (!isRun) {
      const proc = spawn('emulator', ['-avd', 'new'], { detached: true });
      proc.on('close', exit);
    } else {
      exitWhenEmulatorIsClosed();
    }
  });
});

function exitWhenEmulatorIsClosed() {
  isEmulatorWorking(isRun => isRun ? '' : exit());
  setTimeout(exitWhenEmulatorIsClosed, 1000);
}

function isEmulatorWorking(cb) {
  ps.lookup({ command: 'qemu-system', psargs: 'ux' }, (err, results) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    cb(Boolean(results.length));
  });
}

function exit() {
  runSequence('stop', () => process.exit());
}