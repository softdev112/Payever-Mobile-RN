import { observable } from 'mobx';
import type Store from '../../store';

export default class UIStore {
  @observable phoneMode: boolean = true;
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }
}