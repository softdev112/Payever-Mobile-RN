import EventEmitter from 'react-native/Libraries/EventEmitter/EventEmitter';
import WampClient from './WampClient';


export default class SocketApi extends EventEmitter {
  client: WampClient;
  userId: number;

  constructor(client: WampClient, userId: number) {
    super();
    this.client = client;
    this.userId = userId;
    client.on(WampClient.EVENT_WELCOME, ::this.subscribeChannel);
  }

  async getConversation({
    direction = 'before',
    id,
    limit = 30,
    startId = null,
    userId = this.userId,
  }) {
    return this.client.call('messenger/rpc/getConversation', {
      id, startId, direction, limit, userId,
    });
  }

  async sendMessage({
    body,
    channelSetId = '',
    conversationId,
    forwardFromId = null,
    replyToId = null,
    userId = this.userId,
  }) {
    return this.client.call('messenger/rpc/sendMessage', {
      body, channelSetId, conversationId, forwardFromId, replyToId, userId,
    });
  }

  async resolveWhenConnected() {
    const client = this.client;
    switch (client.state) {
      case WebSocket.OPEN: {
        return this;
      }

      case WebSocket.CONNECTING: {
        return new Promise((resolve, reject) => {
          setInterval(() => {
            if (client.state === WebSocket.OPEN) {
              resolve(this);
            }
            if (client.state === WebSocket.CLOSED) {
              reject('Couldn\'t connect to WAMP socket (timeout)');
            }
          }, 100);
        });
      }

      default: {
        throw new Error('Couldn\'t connect to WAMP socket');
      }
    }
  }

  /** @private */
  subscribeChannel() {
    this.client.subscribe(`messenger/chat/channel/${this.userId}/`, (data) => {
      const { action } = data;
      this.emit(action, data);
    });
  }

  close() {
    this.client.close();
  }

  setAccessToken(token) {
    this.client.accessToken = token;
  }
}