import TabBarUI from './model/TabBarUI';
import type Store from '../../store';

export default class UIStore {
  tabBarUI: TabBarUI;
  store: Store;

  constructor(store: Store) {
    this.store = store;
    this.tabBarUI = new TabBarUI();
  }
}