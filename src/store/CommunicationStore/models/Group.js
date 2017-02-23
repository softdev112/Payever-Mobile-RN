import type Avatar from './Avatar';
import type Message from './Message';

export default class Group {
  addDate: string;
  addDateFormated: string;
  avatar: Avatar;
  hasUnread: boolean;
  id: number;
  latestMessage: ?Message;
  name: string;
  participantsCount: string;
  recipient_id: string;
  type: 'marketing-group';
  unreadCount: number;

  constructor(data) {
    Object.assign(this, data);
  }
}