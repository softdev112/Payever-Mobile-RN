/* eslint-disable import/prefer-default-export */
/**
 * @providesModule utils
 */

import logging from 'react-native-logging';
import type PushNotificationsHelper from
  './pushNotificationsHelper/PushNotificationsHelper';
import * as pushExports from './pushNotificationsHelper';

export const pushNotificationsHelper: Push = pushExports;
export const log: Log = logging;

export apiHelper from './apiHelper';
export format from './format';

log.transports.logS.url = 'http://192.168.1.2:8085/log';
log.transports.logS.depth = 5;

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