import { action, observable } from 'mobx';

const TABS = {
  transactions: 0,
  products: 1,
  privateDashboard: 1,
  dashboard: 2,
  communication: 3,
  myStores: 4,
};

export default class TabBarUI {
  tabs = TABS;

  @observable selectedIndex: number = TABS.dashboard;

  @action
  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }
}