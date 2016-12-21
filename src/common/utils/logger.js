/**
 * Module for sending logs to chrome inspector through Stetho
 * It's disabled for ios and for production
 */
import { NativeModules, Platform } from 'react-native';
const StethoLogger = NativeModules.StethoLogger;

global.log = globalLog;
globalLog.patchConsole = false;

if (__DEV__ && Platform.OS === 'android') {
  if (global.originalConsole && globalLog.patchConsole) {
    patchConsole(global.originalConsole);
  }
}

function globalLog(...args) {
  if (!__DEV__ && Platform.OS === 'ios') {
    return;
  }
  logToStetho('log', ...args);
}

function patchConsole(console) {
  ['log', 'info', 'warn', 'error'].forEach((level) => {
    const originalMethod = console[level];
    console[level] = function() {
      logToStetho(level, ...arguments);
      originalMethod.apply(console, arguments);
    }
  })
}

function sendStethoMessage(level, text) {
  if (!StethoLogger) {
    return;
  }

  StethoLogger.sendChromeNotification('Console.messageAdded', {
    message: {
      level,
      text,
      source: 'console-api',
      timestamp: Date.now(),
    }
  });
}

/**
 * Doesn't work yet
 */
function sendStathoConsoleAliCall() {
  if (!StethoLogger) {
    return;
  }


  StethoLogger.sendChromeNotification('Runtime.consoleAPICalled', {
    type: 'log',
    args: [{
      type:        'object',
      className:   'Object',
      description: 'Object',
      objectId:    "{\"injectedScriptId\":1,\"id\":1}",
      preview:     {
        type:        'object',
        description: 'Object',
        overflow:    false,
        properties:  [{name: 'aProperty', type: 'number', value: '1'}]
      }
    }],
    executionContextId: 1,
    timestamp:          Date.now(),
    stackTrace:         {
      callFrames: [{
        functionName: '',
        scriptId:     '1',
        url:          'file:///home/megahertz/Desktop/tmp/test.js',
        lineNumber:   1,
        columnNumber: 9
      }]
    }
  });
}

function logToStetho(level, ...args) {
  try {
    const text = args.map((arg) => {
      if (Array.isArray(arg) || typeof arg === 'object') {
        const cache = [];
        arg = JSON.stringify(arg, null, '  ');
      }
      return arg;
    }).join(' ');
    sendStethoMessage(level, text);
  } catch (e) {

  }
}

function logObjectToStetho() {
  /*
   Example of chrome debug protocol messages:
   From target: {"method":"Page.frameStartedLoading","params":{"frameId":"5850.1"}}
   From target: {"method":"Runtime.executionContextDestroyed","params":{"executionContextId":7}}
   From target: {"method":"Runtime.executionContextsCleared","params":{}}
   From target: {"method":"Runtime.executionContextCreated","params":{"context":{"id":8,"origin":"file://","name":"","auxData":{"isDefault":true,"frameId":"5850.1"}}}}
   From target: {"method":"Page.frameNavigated","params":{"frame":{"id":"5850.1","loaderId":"5850.7","url":"file:///home/megahertz/Desktop/tmp/index.html","securityOrigin":"file://","mimeType":"text/html"}}}
   From target: {"method":"Debugger.scriptParsed","params":{"scriptId":"93","url":"file:///home/megahertz/Desktop/tmp/test.js","startLine":0,"startColumn":0,"endLine":0,"endColumn":31,"executionContextId":8,"hash":"67A2AB6217C76DA91F8DD874C1C2E94120089FA6","executionContextAuxData":{"isDefault":true,"frameId":"5850.1"},"isLiveEdit":false,"sourceMapURL":"","hasSourceURL":false}}
   Paths.scriptParsed: resolved file:///home/megahertz/Desktop/tmp/test.js to /home/megahertz/Desktop/tmp/test.js. webRoot: /home/megahertz/Desktop/tmp
   From target: {"method":"Console.messageAdded","params":{"message":{"source":"console-api","level":"log","text":"[object Object]","url":"file:///home/megahertz/Desktop/tmp/test.js","line":1,"column":9}}}
   From target: {"method":"Runtime.consoleAPICalled","params":{"type":"log","args":[{"type":"object","className":"Object","description":"Object","objectId":"{\"injectedScriptId\":8,\"id\":1}","preview":{"type":"object","description":"Object","overflow":false,"properties":[{"name":"aProperty","type":"number","value":"1"}]}}],"executionContextId":8,"timestamp":1482317667393.508056640625000,"stackTrace":{"callFrames":[{"functionName":"","scriptId":"93","url":"file:///home/megahertz/Desktop/tmp/test.js","lineNumber":0,"columnNumber":8}]}}}
   From target: {"method":"Page.loadEventFired","params":{"timestamp":594862.111601}}
   From target: {"method":"Page.frameStoppedLoading","params":{"frameId":"5850.1"}}
   From target: {"method":"Page.domContentEventFired","params":{"timestamp":594862.111964}}
   */
}

