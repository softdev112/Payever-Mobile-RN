/* eslint-disable strict, import/no-extraneous-dependencies */

'use strict';

const gulp     = require('gulp-task-doc');
const Validate = require('git-validate');

/**
 * Install default git pre-commit hook
 */
gulp.task('install:git-hooks', () => {
  Validate.installScript('lint', 'eslint src');
  Validate.configureHook('pre-commit', ['lint']);
});