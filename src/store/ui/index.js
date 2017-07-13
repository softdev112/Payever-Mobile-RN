import { action, observable } from 'mobx';
import { screenParams } from 'utils';

import type Store from '../../store';

export default class UIStore {
  deepLink: string = '';
  @observable phoneMode: boolean = !screenParams.isTabletLayout();
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  setPhoneMode(mode: boolean) {
    this.phoneMode = mode;
  }

  @action
  setDeepLink(url) {
    this.deepLink = url;
  }
}