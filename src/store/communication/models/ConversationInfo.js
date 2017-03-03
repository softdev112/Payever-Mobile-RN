import { extendObservable, observable } from 'mobx';
import type Avatar from './Avatar';
import type Message from './Message';
import type { ConversationStatus } from './Conversation';

export default class ConversationInfo {
  archived: boolean;
  avatar: ?Avatar;
  hasUnread: ?boolean;
  id: number;
  isBot: ?boolean;
  latestMessage: ?Message;
  name: string;
  notification: boolean;
  recipient_id: ?string;
  @observable status: ?ConversationStatus;
  type: string;
  @observable unreadCount: ?number;

  constructor(data) {
    extendObservable(this, data);
  }

  updateStatus(status) {
    this.status = status;
  }
}