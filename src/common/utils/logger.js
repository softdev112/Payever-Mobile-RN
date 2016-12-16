import { NativeModules, Platform } from 'react-native';
const StethoLogger = NativeModules.StethoLogger;

function consoleMessage(level, text) {
  if (!StethoLogger) {
    return;
  }

  StethoLogger.sendChromeNotification('Console.messageAdded', {
    message: {
      level,
      text,
      source: 'other',
      timestamp: Date.now(),
    }
  });
}

function log(level, ...args) {
  const text = args.map((arg) => {
    if (Array.isArray(arg) || typeof arg === 'object') {
      arg = JSON.stringify(arg, null, '  ');
    }
    return arg;
  }).join(' ');
  consoleMessage(level, text);
}

export function info(...args) {
  log('info', ...args);
}

export function warn(...args) {
  log('warn', ...args);
}

export function error(...args) {
  log('error', ...args);
}