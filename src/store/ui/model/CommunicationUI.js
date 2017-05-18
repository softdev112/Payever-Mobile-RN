import { action, observable } from 'mobx';

export default class CommunicationUI {
  @observable searchMessagesMode: boolean = false;

  @action
  setSearchMessagesMode(mode: boolean) {
    this.searchMessagesMode = mode;
  }
}