import { extendObservable } from 'mobx';

export default class ConversationSettingsData {
  id: number;
  name: string;
  members: Array<any>;
  isOwner: true;

  constructor(data) {
    extendObservable(this, data);
  }
}