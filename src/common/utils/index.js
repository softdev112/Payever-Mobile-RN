/**
 * @providesModule utils
 */

import * as logExports from './log';

/* eslint-disable import/prefer-default-export */
export const log: Log = logExports; // for autocomplete

export apiHelper from './apiHelper';
export registerNotifications from './pushNotifications';

/* eslint-disable no-undef */
type Log = {
  error: (...args) => void;
  warn: (...args) => void;
  info: (...args) => void;
  verbose: (...args) => void;
  debug: (...args) => void;
  silly: (...args) => void;
};