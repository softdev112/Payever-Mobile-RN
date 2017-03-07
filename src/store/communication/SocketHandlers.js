import { runInAction } from 'mobx';

import type CommunicationStore from './index';
import type Message from './models/Message';
import type SocketApi from '../../common/api/MessengerApi/SocketApi';
import type { ConversationStatus } from './models/Conversation';

export default class SocketHandlers {
  store: CommunicationStore;
  socket: SocketApi;

  constructor(store: CommunicationStore) {
    this.store = store;
    this.onEvent = ::this.onEvent;
  }

  onReadMessage(readMessages: Array<ReadMessage>) {
    if (!readMessages.forEach) {
      readMessages = [];
    }

    readMessages.forEach((rm: ReadMessage) => {
      const conversation = this.store.conversations.get(rm.conversationId);
      conversation.setReadStatus(rm.id);
    });
  }

  onUpdateMessage(message: Message) {
    this.store.updateMessage(message);
  }

  onUpdateUserStatus(status: ConversationStatus) {
    this.store.updateUserStatus(status);
  }

  onUpdateTypingStatus(status: ConversationStatus) {
    this.store.updateUserStatus(status, true);
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

type ReadMessage = {
  conversationId: number;
  id: number;
  userId: number;
};