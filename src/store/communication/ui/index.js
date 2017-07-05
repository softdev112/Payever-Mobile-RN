import { action, observable } from 'mobx';

export default class CommunicationUI {
  @observable searchMessagesMode: boolean = false;
  @observable forwardMode: boolean = false;
  @observable selectMode: boolean = false;
  @observable pickContactMode: boolean = false;
  @observable chatScreenOpen: boolean = false;

  @observable chatFooterHeight: number = 50;

  @action
  setSearchMessagesMode(mode: boolean) {
    this.searchMessagesMode = mode;
  }

  @action
  setSelectMode(mode: boolean) {
    this.selectMode = mode;
  }

  @action
  setForwardMode(mode: boolean) {
    this.forwardMode = mode;
  }

  @action
  setPickContactMode(mode: boolean) {
    this.pickContactMode = mode;
  }

  @action
  setChatFooterHeight(height: number) {
    this.chatFooterHeight = height;
  }

  @action
  setChatScreenOpen(chatOpen: boolean) {
    this.chatScreenOpen = chatOpen;
  }
}