import type ObservableArray from 'mobx';
import type AppItem from './AppItem';

import { computed, observable } from 'mobx';
import type Store from './index';

export default class Profile {
  store: Store;

  @observable customers: number;
  @observable followers: number;
  @observable following: number;
  @observable id: number;
  @observable likes: number;
  @observable name: string;
  @observable offers: number;
  @observable sells: number;
  @observable type: string;

  @observable appList: ObservableArray<AppItem> = [];

  @computed get isBusiness() {
    return this.type === 'business';
  }

  get logoSource() {
    throw new Error('Abstract getter');
  }

  get displayName() {
    throw new Error('Abstract getter');
  }

  async getApplications(): Promise<ObservableArray<AppItem>> {
    return this.appList;
  }
}