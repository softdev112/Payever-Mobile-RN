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
transports.stetho.level = 'debug';

function log(level, ...data) {
  const msg = {
    level,
    data: Array.isArray(data) ? data : [data],
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
  const data = msg.data;
  if (console[msg.level]) {
    console[msg.level](...data);
  } else {
    console.log(...data);
  }
}

function transportStetho(msg) {
  if (Platform.OS === 'android') {
    stetho(msg.level, stringifyParams(msg.data));
  }
}

function stringifyParams(params: Array) {
  const isArray = params.length > 1;
  const primitiveTypes = ['number', 'string', 'boolean'];
  const isPrimitive = primitiveTypes.indexOf(typeof params[0]) !== -1;

  if (!isArray && isPrimitive[0]) {
    return params;
  }
  params = params.map((arg) => {
    if (arg instanceof Error) {
      arg = arg.stack + '\n';
    }
    return arg;
  });
  return util.format(...params);
}