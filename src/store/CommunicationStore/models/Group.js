import type { UserAvatar } from './MessengerPrivateInfo';
import type Message from './Message';

export default class Group {
  id: number;
  name: string;
  type: string;
  recipient_id: string;
  hasUnread: boolean;
  unreadCount: number;
  avatar: UserAvatar;
  participantsCount: string;
  addDate: string;
  addDateFormated: string;
  latestMessage: ?Message;
}