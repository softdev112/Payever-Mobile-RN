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
  recipientId: ?string;
  status: ?ConversationStatus;
  type: string;
  unreadCount: ?number;

  constructor(data) {
    Object.assign(this, data);
  }
}