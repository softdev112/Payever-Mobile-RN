import WampClient from './WampClient';

export default class SocketApi {
  client: WampClient;
  userId: number;

  constructor(client: WampClient, userId: number) {
    this.client = client;
    this.userId = userId;
    client.on(WampClient.EVENT_WELCOME, ::this.subscribeChannel);
  }

  async getConversation({
    id,
    startId = null,
    direction = 'before',
    limit = 30,
    userId = this.userId,
  }) {
    return this.client.call('messenger/rpc/getConversation', {
      id, startId, direction, limit, userId,
    });
  }

  async resolveWhenConnected() {
    const client = this.client;
    switch (client.state) {
      case WampClient.STATE_ONLINE: {
        return this;
      }

      case WampClient.STATE_CONNECTING: {
        return new Promise((resolve, reject) => {
          setInterval(() => {
            if (client.state === WampClient.STATE_ONLINE) {
              resolve(this);
            }
            if (client.state === WampClient.STATE_TIMEOUT) {
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
      console.log('CHANNEL CALL', data);
    });
  }

  close() {
    this.client.close();
  }
}