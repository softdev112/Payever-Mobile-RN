/* eslint-disable sort-class-members/sort-class-members */
import EventEmitter from 'react-native/Libraries/EventEmitter/EventEmitter';

const MSG_WELCOME     = 0;
const MSG_PREFIX      = 1;
const MSG_CALL        = 2;
const MSG_CALL_RESULT = 3;
const MSG_CALL_ERROR  = 4;
const MSG_SUBSCRIBE   = 5;
const MSG_UNSUBSCRIBE = 6;
const MSG_PUBLISH     = 7;
const MSG_EVENT       = 8;

const CONNECTION_TIMEOUT = 7000;

/**
 * WAMP protocol v1 implementation for GeniusesOfSymfony/WebSocketBundle
 * Based on https://github.com/Swatinem/wamp
 */
export default class WampClient extends EventEmitter {
  static STATE_OFFLINE    = 0;
  static STATE_CONNECTING = 1;
  static STATE_ONLINE     = 2;
  static STATE_TIMEOUT    = 3;

  static EVENT_WELCOME = 'socket/welcome';
  static EVENT_STATE   = 'socket/state';

  socket: WebSocket;
  state: number = WampClient.STATE_OFFLINE;

  listeners = {};
  prefixes = {};
  calls = {};
  omitSubscribe = false;

  constructor(host) {
    super();
    this.checkTimeout();
    this.socket = new WebSocket(host);
    //noinspection JSUnresolvedFunction
    this.socket.onmessage = ::this.onMessage;
  }

  checkTimeout() {
    this.setState(WampClient.STATE_CONNECTING);
    this.on(
      WampClient.EVENT_WELCOME,
      () => this.setState(WampClient.STATE_ONLINE)
    );
    setTimeout(() => {
      if (this.state !== WampClient.STATE_ONLINE) {
        this.setState(WampClient.STATE_TIMEOUT);
      }
    }, CONNECTION_TIMEOUT);
  }

  on(event, listener, context = null) {
    return this.addListener(event, listener, context);
  }

  setState(state: number) {
    this.state = state;
    this.emit(WampClient.EVENT_STATE, state);
  }

  /** @private */
  send(data) {
    console.log('SEND', data);
    this.socket.send(JSON.stringify(data));
  }

  /** @private */
  emitHandler(event, data) {
    (this.listeners[event] || [])
      .forEach(fn => fn(data));
  }

  /** @private */
  onMessage(event) {
    const message = JSON.parse(event.data);
    const type = message.shift();
    console.log('MSG', message);

    // eslint-disable-next-line default-case
    switch (type) {
      case MSG_WELCOME: {
        this.onWelcome(message);
        break;
      }

      case MSG_EVENT: {
        this.onEvent(message[0], message[1]);
        break;
      }

      case MSG_CALL_RESULT:
      case MSG_CALL_ERROR: {
        const callNumber = message[0];
        const fn = this.calls[callNumber];
        delete this.calls[callNumber];

        let result = message[1];
        if (type === MSG_CALL_ERROR) {
          result = new Error(message[2]);
          result.uri = message[1];
          if (message.length === 4) {
            result.details = message[3];
          }
        }

        if (!fn) {
          const error = new Error(`Unmatched ${type} received from server`);
          error.type = type;
          error.callId = callNumber;
          error[type === MSG_CALL_ERROR ? 'error' : 'result'] = result;
          this.emit('error', error);
          return;
        }

        if (type === MSG_CALL_RESULT) {
          fn(undefined, result);
        } else {
          fn(result);
        }
        break;
      }
    }
  }

  /** @private */
  onWelcome(message) {
    const version = message[1];
    const server = message[2];
    if (version !== 1) {
      this.emit(
        'error',
        new Error(
          `Server ${server} uses incompatible protocol version ${version}`
        )
      );
      return;
    }

    if (this.sessionId) {
      Object.keys(this.prefixes).forEach((prefix) => {
        const expanded = this.prefixes[prefix];
        this.send([MSG_PREFIX, prefix, expanded]);
      });
      if (!this.omitSubscribe) {
        Object.keys(this.listeners).forEach((uri) => {
          this.send([MSG_SUBSCRIBE, uri]);
        });
      }
    }

    this.sessionId = message[0];

    this.emit(WampClient.EVENT_WELCOME, {
      server,
      version,
      sessionId: this.sessionId,
    });
  }

  /** @private */
  onEvent(event, data) {
    this.emit('event', event, data);
    // emit the original version straight away
    this.emitHandler(event, data);
    Object.keys(this.prefixes, (prefix) => {
      const expanded = this.prefixes[prefix];
      prefix += ':';
      if (event.indexOf(prefix) === 0) {
        // if the prefix matches, also emit the expanded version
        this.emitHandler(expanded + event.slice(prefix.length), data);
      } else if (event.indexOf(expanded) === 0) {
        // similarly, also emit the prefixed version if the expanded matches
        this.emitHandler(prefix + event.slice(expanded.length), data);
      }
    });
  }

  close() {
    this.socket.close();
  }

  prefix(prefix, uri) {
    this.prefixes[prefix] = uri;
    this.send([MSG_PREFIX, prefix, uri]);
  }

  subscribe(uri, fn) {
    this.listeners[uri] = this.listeners[uri] || [];
    this.listeners[uri].push(fn);

    if (this.listeners[uri].length === 1 && !this.omitSubscribe) {
      this.send([MSG_SUBSCRIBE, uri]);
    }
  }

  unsubscribe(uri, fn) {
    const listeners = this.listeners[uri];
    if (fn) {
      const i = listeners.indexOf(fn);
      listeners.splice(i, 1);
      if (listeners.length > 0) return;
    }
    delete this.listeners[uri];
    if (!this.omitSubscribe) {
      this.send([MSG_UNSUBSCRIBE, uri]);
    }
  }

  publish(...params) {
    this.send([MSG_PUBLISH, ...params]);
  }

  call(uri, ...params) {
    return new Promise((resolve, reject) => {
      let isResolved = false;
      const callId = Math.random().toString(36).substring(2);
      this.calls[callId] = (e, result) => {
        isResolved = true;
        if (e) {
          reject(e);
        } else {
          resolve({ ok: true, data: result });
        }
      };
      this.send([MSG_CALL, callId, uri, ...params]);
      setTimeout(() => {
        if (isResolved) return;
        this.calls[callId] = () => {};
        reject(`Error Calling ${uri}: Timeout`);
      }, CONNECTION_TIMEOUT);
    });
  }
}