import { action, observable } from 'mobx';

export default class CommunicationUI {
  @observable searchMessagesMode: boolean = false;
  @observable forwardMode: boolean = false;
  @observable selectMode: boolean = false;

  @action
  setSearchMessagesMode(mode: boolean) {
    this.searchMessagesMode = mode;
  }

  @action
  setSelectMode(mode) {
    this.selectMode = mode;
  }

  @action
  setForwardMode(mode) {
    this.forwardMode = mode;
  }
}