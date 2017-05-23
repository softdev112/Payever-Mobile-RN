import { extendObservable } from 'mobx';
import type Avatar from './Avatar';
import type Contact from './Contact';

export default class ConversationSettingsInfo {
  id: number;
  avatar: ?Avatar;
  name: string;
  notification: boolean;
  offers: Array;
  contacts: Array<Contact>;
  channels: Array;
  actions: Object;

  constructor(data) {
    extendObservable(this, data);
  }
}