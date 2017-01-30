import type Avatar from './Avatar';
import type Conversation from './Conversation';

export default class Message {
  avatar: Avatar;
  body: string;
  conversation: Conversation;
  date: string;
  dateFormated: string;
  dateOnly: string;
  deletable: boolean;
  deleted: boolean;
  editable: boolean;
  editBody: string;
  edited: boolean;
  forwardFrom: ?Object;
  id: number;
  isSystem: boolean;
  medias: Array<any>;
  offer: ?Object;
  offerId: ?number;
  opponentUnread: boolean;
  own: boolean;
  recipient: string;
  replyTo: ?Object;
  senderId: number;
  senderName: string;
  unread: boolean;
}