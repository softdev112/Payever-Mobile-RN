import { each } from 'lodash';
import { Platform } from 'react-native';
import * as util from './util';
import stetho from './stetho';

const LEVELS = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

export const error   = log.bind(null, 'error');
export const warn    = log.bind(null, 'warn');
export const info    = log.bind(null, 'info');
export const verbose = log.bind(null, 'verbose');
export const debug   = log.bind(null, 'debug');
export const silly   = log.bind(null, 'silly');

export const transports = {
  console: transportConsole,
  stetho: transportStetho,
};

transports.console.level = 'silly';
transports.stetho.level = 'verbose';

function log(level, ...args) {
  let params = args.slice(1);
  params = params.map((arg) => {
    if (arg instanceof Error) {
      arg = arg.stack + '\n';
    }
    return arg;
  });
  const text = util.format(...params);

  const msg = {
    level,
    text,
    date: new Date(),
  };

  each(transports, (transport) => {
    if (typeof transport !== 'function') {
      return;
    }
    if (!compareLevels(transport.level, level)) {
      return;
    }
    transport(msg);
  });
}

function compareLevels(passLevel, checkLevel) {
  const pass = LEVELS.indexOf(passLevel);
  const check = LEVELS.indexOf(checkLevel);
  if (check === -1 || pass === -1) {
    return true;
  }
  return check <= pass;
}

function transportConsole(msg) {
  const text = msg.text;
  if (console[msg.level]) {
    console[msg.level](text);
  } else {
    console.log(text);
  }
}

function transportStetho(msg) {
  if (Platform.OS === 'android') {
    stetho(msg.level, msg.text);
  }
}