import type Avatar from './Avatar';
import Offer from '../../OffersStore/models/Offer';
import Media from './Media';

export default class Message {
  avatar: Avatar;
  body: string; // HTML-view of the message
  conversation: {
    archived: boolean; // Is the conversation archived by current user
    id: number;
    name: string;
    notification: boolean;
    type: 'conversation';
  };
  date: string; // yyyy-MM-dd'T'HH:mm:ssZZZZZ
  //noinspection SpellCheckingInspection
  dateFormated: string;
  dateOnly: string;
  deletable: boolean;
  deleted: boolean;
  editable: boolean;
  editBody: string; // Plain text view of the message to be able to edit it
  edited: boolean;
  forwardFrom: ?{
    id: number;
    senderName: string;
  };
  id: number; // Message unique ID
  isSystem: boolean;
  medias: Array<Media>;
  offer: Offer;
  offerId: ?number;
  opponentUnread: boolean; // Is unread by any of the chat opponent users
  own: boolean; // Is message own for current user
  recipient: string;
  replyTo: ?{
    id: number;
    senderName: string;
    body: string;
    deleted: boolean;
  };
  senderId: number;
  senderName: string;
  unread: boolean; // Is unread for requested it user

  constructor(data) {
    if (data.offer) {
      data.offer = new Offer(data.offer);
    }
    if (data.medias && data.medias.length > 0) {
      data.medias = data.medias.map(m => new Media(m));
    }

    Object.assign(this, data);
  }
}