import { action, observable } from 'mobx';
import { ScreenParams } from 'utils';

import type Store from '../../store';

export default class UIStore {
  @observable phoneMode: boolean = !ScreenParams.isTabletLayout();
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  setPhoneMode(mode: boolean) {
    this.phoneMode = mode;
  }
}