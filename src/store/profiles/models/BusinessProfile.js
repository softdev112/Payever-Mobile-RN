//noinspection JSUnresolvedVariable
import { computed, extendObservable, observable, ObservableArray } from 'mobx';
import { images } from 'ui';
import type ActivityItem from './ActivityItem';
import type AppItem from './AppItem';
import Business from './Business';
import Profile from './Profile';

export default class BusinessProfile extends Profile {
  @observable business: Business;
  @observable stores: number;

  @observable applications: ObservableArray<AppItem>    = [];
  @observable activities: ObservableArray<ActivityItem> = [];
  @observable todos: ObservableArray<ActivityItem>      = [];

  constructor(data, store) {
    super();
    this.store = store;
    if (data.business) {
      data.business = new Business(data.business, store);
    }

    extendObservable(this, data);
  }

  @computed get logoSource() {
    if (this.business.logo) {
      return { uri: this.business.logo };
    }

    return images.noBusiness;
  }

  @computed get displayName() {
    return this.business.company_name || this.business.name;
  }
}