import { NativeModules } from 'react-native';
const StethoLogger = NativeModules.StethoLogger;

/**
 * It's just an experiment.
 * @param message
 */
global.log = function(message) {
  StethoLogger.sendChromeNotification('Console.messageAdded', {
    message: {
      source: 'other',
      level: 'log',
      type: 'log',
      text: { id : 1 },
      timestamp: Date.now(),
      line: 2,
      column: 13,
      url: 'file:///c:/page/script.js',
      executionContextId: 2,
      parameters: [
        { type: 'string', value: '{"test":1}' }
      ]
    }
  });

  StethoLogger.sendChromeNotification('Runtime.evaluate', {
    expression: 'console.log(123)'
  });
};