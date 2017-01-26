import type { UserAvatar } from './MessengerPrivateInfo';
import type Message from './Message';

export default class Conversation {
  id: number;
  name: string;
  type: string;
  archived: boolean;
  notification: boolean;
  recipientId: ?string;
  status: ?ConversationStatus;
  hasUnread: ?boolean;
  unreadCount: ?number;
  isBot: ?boolean;
  avatar: ?UserAvatar;
  latestMessage: ?Message;
}

type ConversationStatus = {
  online: boolean;
  lastVisit: string;
  label: string;
  userId: number;
};