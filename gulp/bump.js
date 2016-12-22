'use strict';

const argv           = require('minimist')(process.argv.slice(2));
const currentVersion = require('../package.json').version;

const gulp    = require('gulp-task-doc');
const replace = require('gulp-replace');

/**
 * Bump version number
 * --version=x.x.x Set the exactly version
 */
gulp.task('bump', ['bump:package', 'bump:android', 'bump:ios']);

// @internal
gulp.task('bump:package', () => {
  return gulp.src('package.json')
    .pipe(replace(/"version": "[\d.]+"/, `"version": "${getBumped()}"`))
    .pipe(gulp.dest('.'));
});

// @internal
gulp.task('bump:android', () => {
  const v = getBumped();
  const [major, minor, build] = v.split('.');
  const versionCode = major * 1000 * 1000 + minor * 1000 + build * 1;
  return gulp.src('android/app/build.gradle')
    .pipe(replace(/versionName "[\d.]+"/, `versionName "${v}"`))
    .pipe(replace(/versionCode \d+/, `versionCode ${versionCode}`))
    .pipe(gulp.dest('android/app'));
});

// @internal
gulp.task('bump:ios', () => {
  const v = getBumped();
  return gulp.src('ios/PayeverMobile/Info.plist')
    .pipe(replace(
      /<key>CFBundleShortVersionString<\/key>\n\s+<string>[\d.]+/,
      `<key>CFBundleShortVersionString</key>\n\t<string>${v}`
    ))
    .pipe(replace(
      /<key>CFBundleVersion<\/key>\n\s+<string>[\d.]+/,
      `<key>CFBundleVersion</key>\n\t<string>${v}`
    ))
    .pipe(gulp.dest('ios/PayeverMobile'));
});

function getBumped() {
  if (argv.version) {
    return argv.version;
  }

  const currentSemVer = currentVersion.split('.');
  currentSemVer[2]++;
  return currentSemVer.join('.');
}