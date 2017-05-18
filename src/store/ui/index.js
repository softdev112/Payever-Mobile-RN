import TabBarUI from './model/TabBarUI';
import CommunicationUI from './model/CommunicationUI';
import type Store from '../../store';

export default class UIStore {
  tabBarUI: TabBarUI;
  communicationUI: CommunicationUI;

  store: Store;

  constructor(store: Store) {
    this.store = store;
    this.tabBarUI = new TabBarUI();
    this.communicationUI = new CommunicationUI();
  }
}