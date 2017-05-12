import { action, observable } from 'mobx';

export default class TabBarUI {
  @observable selectedIndex: number = 1;

  @action
  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }
}