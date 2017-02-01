import type Avatar from './Avatar';

export default class Message {
  avatar: Avatar;
  body: string;
  conversation: {
    archived: boolean;
    id: number;
    name: string;
    notification: boolean;
    type: 'conversation';
  };
  date: string;
  //noinspection SpellCheckingInspection
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

  constructor(data) {
    Object.assign(this, data);
  }
}