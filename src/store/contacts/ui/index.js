import { action, observable } from 'mobx';

export default class ContactsUI {
  @observable selectMode: boolean = false;

  @action
  setSelectMode(mode) {
    this.selectMode = mode;
  }
}