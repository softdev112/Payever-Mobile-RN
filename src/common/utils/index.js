/**
 * @providesModule utils
 */

import type PushNotificationsHelper from
  './pushNotificationsHelper/PushNotificationsHelper';

import * as logExports from './log';
import * as pushExports from './pushNotificationsHelper';

/* eslint-disable import/prefer-default-export */
export const log: Log = logExports; // for autocomplete
export const pushNotificationsHelper: Push = pushExports;

export apiHelper from './apiHelper';
export format from './format';

/* eslint-disable no-undef */
type Log = {
  error: (...args) => void;
  warn: (...args) => void;
  info: (...args) => void;
  verbose: (...args) => void;
  debug: (...args) => void;
  silly: (...args) => void;
};

type Push = {
  createInstance: (api, userProfile) => PushNotificationsHelper;
  getInstance: () => PushNotificationsHelper;
};