import { extendObservable, observable } from 'mobx';
import Message from './Message';

export default class Conversation {
  archived: boolean;
  id: number;
  @observable messages: Array<Message>;
  name: string;
  status: ConversationStatus;
  type: 'conversation';

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
}

export type ConversationStatus = {
  label: ?string;
  lastVisit: ?string;
  online: boolean;
  userId: number;
};