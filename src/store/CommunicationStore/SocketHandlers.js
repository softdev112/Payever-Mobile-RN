import { runInAction } from 'mobx';

import type CommunicationStore from './index';
import type Message from './models/Message';
import type SocketApi from '../../common/api/MessengerApi/SocketApi';

export default class SocketHandlers {
  store: CommunicationStore;
  socket: SocketApi;

  constructor(store: CommunicationStore) {
    this.store = store;
    this.onEvent = ::this.onEvent;
  }

  onUpdateMessage(message: Message) {
    const conversation = this.store.conversations[message.conversation.id];
    if (conversation) {
      conversation.updateMessage(message);
    }
  }

  subscribe(socket: SocketApi) {
    if (this.socket && this.socket.client) {
      this.socket.client.removeListener('event', this.onEvent);
    }

    this.socket = socket;
    socket.client.on('event', this.onEvent);
  }

  // eslint-disable-next-line sort-class-members/sort-class-members
  onEvent(event, data) {
    const action = data.action;
    if (!action) return;

    const method = 'on' + action.charAt(0).toUpperCase() + action.substr(1);
    if (!this[method]) return;

    runInAction(`Run SocketHandlers.${method}`, () => {
      this[method](data.data);
    });
  }
}