/* eslint-disable max-len, global-require */
import EventEmitter from 'react-native/Libraries/EventEmitter/EventEmitter';
import WampClient from '../MessengerApi/WampClient';

const MSG_WELCOME     = 0;
const MSG_PREFIX      = 1;
// const MSG_CALL        = 2;
const MSG_CALL_RESULT = 3;
const MSG_CALL_ERROR  = 4;
const MSG_SUBSCRIBE   = 5;
// const MSG_UNSUBSCRIBE = 6;
// const MSG_PUBLISH     = 7;
const MSG_EVENT       = 8;
const EVENT_WELCOME = 'socket/welcome';
const EVENT_ERROR   = 'socket/error';

WebSocket = jest.fn(() => ({
  readyState: 1111,
  close: jest.fn(),
}));

WebSocket.CONNECTING = 2222;
WebSocket.CLOSED = 3333;

describe('api/MessengerApi/WampClient', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('WampClient/main functions', () => {
    it('connect() should be created and initialized well', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);

      expect(global.WebSocket).toHaveBeenCalled();
      expect(wampClient).toBeInstanceOf(WampClient);
      expect(wampClient).toBeInstanceOf(EventEmitter);
      expect(wampClient.host).toBe('host');
      expect(await wampClient.accessToken).toBe('token');
      expect(wampClient.enableLogging).toBe(true);
      expect(global.setInterval).toHaveBeenCalled();
      expect(global.setInterval).toHaveBeenCalledWith(
        expect.any(Function),
        2000
      );
      expect(wampClient.socket).toBeTruthy();
      expect(wampClient.socket.onmessage).toBeInstanceOf(Function);
      expect(wampClient.socket.onerror).toBeInstanceOf(Function);
      expect(wampClient.socket.onclose).toBeInstanceOf(Function);
    });

    it('state should return ready state (fake 1111) if it already created and CONNECTING (fake 2222) if not', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      expect(wampClient.state).toBe(1111);

      wampClient.socket = null;
      expect(wampClient.state).toBe(2222);
    });

    it('checkConnection() should NOT call setTimeout if checkConnectionInterval === null', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.checkConnectionInterval = null;

      wampClient.checkConnection();
      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('checkConnection() should NOT call setTimeout if state !== WebSocket.CLOSED', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);

      // Tricky mocking because we can not set state we do it by
      // faking socket.readyState
      wampClient.socket.readyState = WebSocket.CONNECTING;

      wampClient.checkConnection();
      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('checkConnection() should call setTimeout if state === WebSocket.CLOSED', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);

      // Tricky mocking because we can not set state we do it by
      // faking socket.readyState
      wampClient.socket.readyState = WebSocket.CLOSED;

      wampClient.checkConnection();
      expect(setTimeout).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it('on(event, listener, context = null) should call addEventListener if all params are fine', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      const addListenerFunc = jest.fn();
      wampClient.addListener = addListenerFunc;

      wampClient.on('event', () => {
      }, { context: 'context' });

      expect(addListenerFunc).toHaveBeenCalled();
      expect(addListenerFunc).toHaveBeenCalledWith(
        'event',
        expect.any(Function),
        { context: 'context' }
      );
    });

    it('on(event, listener, context = null) should NOT call addEventListener if event = undefined || listener = null or not a function', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      const addListenerFunc = jest.fn();
      wampClient.addListener = addListenerFunc;

      wampClient.on('', () => {
      }, { context: 'context' });
      wampClient.on(null, () => {
      }, { context: 'context' });
      wampClient.on(undefined, () => {
      }, { context: 'context' });
      wampClient.on('event', null, { context: 'context' });
      wampClient.on('event', undefined, { context: 'context' });
      wampClient.on('event', 'listener', { context: 'context' });
      wampClient.on('event', {}, { context: 'context' });

      expect(addListenerFunc).not.toHaveBeenCalled();
    });

    it('send(data) should call socket.send', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.socket.send = jest.fn();

      wampClient.send({ data: 'data' });

      expect(wampClient.socket.send).toHaveBeenCalled();
      expect(wampClient.socket.send).toHaveBeenCalledWith(
        JSON.stringify({ data: 'data' })
      );
    });

    it('emitHandler(event, data) should call all internal {event} listeners with {data}', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      wampClient.internalListeners.onclick = [listener1, listener2];

      wampClient.emitHandler('onclick', { data: 'data' });

      expect(listener1).toHaveBeenCalled();
      expect(listener1).toHaveBeenCalledWith({ data: 'data' });
      expect(listener2).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith({ data: 'data' });
    });

    it('emitHandler(event, data) should NOT call all internal {event} listeners with {data} if event = undefined', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      wampClient.internalListeners.onclick = [listener1, listener2];

      expect(() => wampClient.emitHandler('', { data: 'data' })).not.toThrow();
      expect(() => wampClient.emitHandler(undefined, { data: 'data' }))
        .not.toThrow();
      expect(() => wampClient.emitHandler(null, { data: 'data' }))
        .not.toThrow();

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('onMessage(event) should call onWelcome if it was ON_WELCOME event', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      const onWelcomeSpy = jest.spyOn(wampClient, 'onWelcome');

      const event = { data: JSON.stringify([MSG_WELCOME]) };

      wampClient.onMessage(event);

      expect(onWelcomeSpy).toHaveBeenCalled();
      expect(onWelcomeSpy).toHaveBeenCalledWith([]);
    });

    it('onMessage(event) should call onEvent if it was ON_EVENT event', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      const onEventSpy = jest.spyOn(wampClient, 'onEvent');

      const event = { data: JSON.stringify([MSG_EVENT, 1, 2]) };

      wampClient.onMessage(event);

      expect(onEventSpy).toHaveBeenCalled();
      expect(onEventSpy).toHaveBeenCalledWith(1, 2);
    });

    it('onMessage(event) should call function from this.calls if it was ON_RESULT event', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      const callFn = jest.fn();
      wampClient.calls[1] = callFn;

      const event = { data: JSON.stringify([MSG_CALL_RESULT, 1, 2]) };

      wampClient.onMessage(event);

      expect(callFn).toHaveBeenCalled();
      expect(callFn).toHaveBeenCalledWith(undefined, 2);
    });

    it('onMessage(event) should NOT call function from this.calls if it was ON_RESULT event and call function undefined', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.calls[1] = null;
      wampClient.emit = jest.fn();

      const event = { data: JSON.stringify([MSG_CALL_RESULT, 1, 2]) };

      wampClient.onMessage(event);

      expect(wampClient.emit).toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalledWith(
        'error',
        new Error(`Unmatched ${MSG_CALL_RESULT} received from server`)
      );
    });

    it('onMessage(event) should call function from this.calls if it was ON_ERROR event', async (done) => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      const callFn = jest.fn((result) => {
        expect(result.uri).toBe(2);
        expect(result.details).toBe(4);
        done();
      });
      wampClient.calls[1] = callFn;

      const event = { data: JSON.stringify([MSG_CALL_ERROR, 1, 2, 3, 4]) };

      wampClient.onMessage(event);

      expect(callFn).toHaveBeenCalled();
      expect(callFn).toHaveBeenCalledWith(new Error(3));
    });

    it('onMessage(event) should NOT call function from this.calls if it was ON_ERROR event and call function is undefined', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.calls[1] = null;
      wampClient.emit = jest.fn();

      const event = { data: JSON.stringify([MSG_CALL_ERROR, 1, 2, 3, 4]) };

      wampClient.onMessage(event);

      expect(wampClient.emit).toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalledWith(
        'error',
        new Error(`Unmatched ${MSG_CALL_ERROR} received from server`)
      );
    });


    it('onError(event) should call this.emit with WampClient.EVENT_ERROR and event object', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.emit = jest.fn();

      wampClient.onError({ event: 'event' });

      expect(wampClient.emit).toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalledWith(
        EVENT_ERROR,
        { event: 'event' }
      );
    });

    it('onWelcome(message) should call this.emit with incompatible ERROR if it receive message with version !== 1', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.emit = jest.fn();
      wampClient.send = jest.fn();

      wampClient.onWelcome([0, 2, 1]);

      expect(wampClient.send).not.toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalledWith(
        EVENT_ERROR,
        new Error('Server 1 uses incompatible protocol version 2')
      );
    });

    it('onWelcome(message) should set sessionId and call this.emit with WELCOME event', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.emit = jest.fn();
      wampClient.send = jest.fn();

      wampClient.onWelcome([1111, 1, 1]);

      expect(wampClient.sessionId).toBe(1111);
      expect(wampClient.send).not.toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalledWith(
        EVENT_WELCOME,
        { server: 1, sessionId: 1111, version: 1 }
      );
    });

    it('onWelcome(message) should call this.send for all prefixes and internalListeners (this.omitSubscribe = false) if sessionId already sets', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.emit = jest.fn();
      wampClient.send = jest.fn();

      wampClient.prefixes = {
        1: { prefix: 'prefix 1' },
        2: { prefix: 'prefix 2' },
        3: { prefix: 'prefix 3' },
      };
      wampClient.omitSubscribe = false;
      wampClient.internalListeners = {
        uri1: { listener: 'listener1' },
        uri2: { listener: 'listener1' },
        uri3: { listener: 'listener1' },
      };
      wampClient.sessionId = 1111;

      wampClient.onWelcome([1111, 1, 1]);

      expect(wampClient.send).toHaveBeenCalledTimes(6);
      expect(wampClient.send).toHaveBeenLastCalledWith(
        [MSG_SUBSCRIBE, 'uri3']
      );
      expect(wampClient.emit).toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalledWith(
        EVENT_WELCOME,
        { server: 1, sessionId: 1111, version: 1 }
      );
    });

    it('onWelcome(message) should call this.send for all prefixes and NOT call for internalListeners if omitSubscribe = true', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.emit = jest.fn();
      wampClient.send = jest.fn();

      wampClient.prefixes = {
        1: { prefix: 'prefix 1' },
        2: { prefix: 'prefix 2' },
        3: { prefix: 'prefix 3' },
      };
      wampClient.omitSubscribe = true;
      wampClient.internalListeners = {
        uri1: { listener: 'listener1' },
        uri2: { listener: 'listener1' },
        uri3: { listener: 'listener1' },
      };
      wampClient.sessionId = 1111;

      wampClient.onWelcome([1111, 1, 1]);

      expect(wampClient.send).toHaveBeenCalledTimes(3);
      expect(wampClient.send).toHaveBeenLastCalledWith(
        [MSG_PREFIX, '3', { prefix: 'prefix 3' }]
      );
      expect(wampClient.emit).toHaveBeenCalled();
      expect(wampClient.emit).toHaveBeenCalledWith(
        EVENT_WELCOME,
        { server: 1, sessionId: 1111, version: 1 }
      );
    });

    it('onEvent(event, data) should call this.emit, this.emitHandler once if prefixes = {}', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.emit = jest.fn();
      wampClient.emitHandler = jest.fn();

      wampClient.onEvent('event', { data: 'data' });

      expect(wampClient.emit).toHaveBeenCalledTimes(1);
      expect(wampClient.emit).toHaveBeenCalledWith(
        'event', 'event', { data: 'data' }
      );
      expect(wampClient.emitHandler).toHaveBeenCalledTimes(1);
      expect(wampClient.emitHandler).toHaveBeenCalledWith(
        'event', { data: 'data' }
      );
    });

    it('onEvent(event, data) should call this.emit once and this.emitHandler several times if prefixes !== {} end event starts from prefix', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.emit = jest.fn();
      wampClient.emitHandler = jest.fn();

      wampClient.prefixes = {
        prefix: 'expanded',
      };
      wampClient.onEvent('prefix:', { data: 'data' });

      expect(wampClient.emit).toHaveBeenCalledTimes(1);
      expect(wampClient.emit).toHaveBeenCalledWith(
        'event', 'prefix:', { data: 'data' }
      );
      expect(wampClient.emitHandler).toHaveBeenCalledTimes(2);
      expect(wampClient.emitHandler).toHaveBeenLastCalledWith(
        'expanded', { data: 'data' }
      );
    });

    it('onEvent(event, data) should call this.emit once and this.emitHandler several times if prefixes !== {} end event starts from expanded', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.emit = jest.fn();
      wampClient.emitHandler = jest.fn();

      wampClient.prefixes = {
        prefix: 'expanded',
      };
      wampClient.onEvent('expanded', { data: 'data' });

      expect(wampClient.emit).toHaveBeenCalledTimes(1);
      expect(wampClient.emit).toHaveBeenCalledWith(
        'event', 'expanded', { data: 'data' }
      );
      expect(wampClient.emitHandler).toHaveBeenCalledTimes(2);
      expect(wampClient.emitHandler).toHaveBeenLastCalledWith(
        'prefix:', { data: 'data' }
      );
    });

    it('close() should call clearInterval, this.socket.close() and set this.checkConnectionInterval = null', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);

      wampClient.close();

      expect(clearInterval).toHaveBeenCalled();
      expect(wampClient.socket.close).toHaveBeenCalled();
      expect(wampClient.checkConnectionInterval).toBeNull();
    });

    it('subscribe(uri, fn) should add event listener and call this.send if this.internalListeners[uri].length === 1 && !this.omitSubscribe', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.send = jest.fn();
      const listener = jest.fn();

      wampClient.omitSubscribe = false;
      wampClient.subscribe('uri', listener);

      expect(wampClient.send).toHaveBeenCalled();
      expect(wampClient.send).toHaveBeenCalledWith(
        [MSG_SUBSCRIBE, 'uri']
      );
      expect(wampClient.internalListeners.uri).toHaveLength(1);
      expect(wampClient.internalListeners.uri[0]).toEqual(listener);
    });

    it('subscribe(uri, fn) should add event listener and should NOT call this.send this.omitSubscribe === true', async () => {
      const wampClient = await new WampClient('host', Promise.resolve('token'), true);
      wampClient.send = jest.fn();
      const listener = jest.fn();

      wampClient.omitSubscribe = true;
      wampClient.subscribe('uri', listener);

      expect(wampClient.send).not.toHaveBeenCalled();
      expect(wampClient.internalListeners.uri).toHaveLength(1);
      expect(wampClient.internalListeners.uri[0]).toEqual(listener);
    });
  });
});