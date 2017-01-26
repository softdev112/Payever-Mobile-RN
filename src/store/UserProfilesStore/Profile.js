import { computed, observable, ObservableArray } from 'mobx';

import type AppItem from './AppItem';
import type ActivityItem from './ActivityItem';
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
  @observable activityList: ObservableArray<ActivityItem> = [];
  @observable todoList: ObservableArray<ActivityItem> = [];

  @computed get isBusiness() {
    return this.type === 'business';
  }

  get logoSource() {
    throw new Error('Abstract getter');
  }

  get displayName() {
    throw new Error('Abstract getter');
  }
}