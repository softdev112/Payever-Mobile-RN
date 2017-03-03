import { extendObservable, observable } from 'mobx';
import Message from './Message';

export default class Conversation {
  archived: boolean;
  id: number;
  @observable messages: Array<Message> = [];
  name: string;
  @observable status: ConversationStatus;
  type: ConversationType;

  constructor(data) {
    data.messages = (data.messages || []).map(m => new Message(m));
    extendObservable(this, data);
  }

  updateMessage(message: Message) {
    if (!(message instanceof Message)) {
      message = new Message(message);
    }

    if (message.conversation.id !== this.id) {
      return;
    }

    const existedIdx = this.messages.findIndex(m => m.id === message.id);
    if (existedIdx !== -1) {
      this.messages[existedIdx] = message;
      return;
    }

    this.messages.push(message);
  }

  updateStatus(status) {
    this.status = status;
  }

  getUnreadIds() {
    return this.messages
      .filter((message: Message) => message.unread)
      .map((message: Message) => message.id);
  }

  setReadStatus(messageId) {
    this.messages
      .filter((message: Message) => message.id === messageId)
      .forEach((message: Message) => message.opponentUnread = false);
  }
}

export type ConversationStatus = {
  conversationId?: number;
  label: ?string;
  lastVisit: ?string;
  online: boolean;
  userId: number;
};

export type ConversationType = 'conversation' | 'chat-group'
  | 'marketing-group';