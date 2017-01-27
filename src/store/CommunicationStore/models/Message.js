import type { UserAvatar } from './MessengerInfo';
import type Conversation from './Conversation';

export default class Message {
  id: number;
  body: string;
  editBody: string;
  offerId: ?number;
  offer: ?Object;
  senderId: number;
  senderName: string;
  date: string;
  dateOnly: string;
  dateFormated: string;
  avatar: UserAvatar;
  own: boolean;
  isSystem: boolean;
  replyTo: ?Object;
  forwardFrom: ?Object;
  edited: boolean;
  deleted: boolean;
  editable: boolean;
  deletable: boolean;
  conversation: Conversation;
  recipient: string;
  unread: boolean;
  opponentUnread: boolean;
  medias: Array<any>;
}