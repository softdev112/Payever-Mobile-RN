import { computed, observable, extendObservable, runInAction } from 'mobx';
import Profile from './Profile';
import Business from './Business';
import AppItem from './AppItem';

import imgNoBusiness from './images/no-business.png';

export default class BusinessProfile extends Profile {
  @observable business: Business;
  @observable stores: number;

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
    } else {
      return imgNoBusiness;
    }
  }

  @computed get displayName() {
    return this.business.companyName || this.business.name;
  }

  async getApplications(): Promise<ObservableArray<AppItem>> {
    if (this.appList.length) {
      return this.appList;
    }

    const resp = await this.store.api.menu.getList(this.id);
    if (resp.ok) {
      runInAction('Set application to the profile', () => {
        this.appList = resp.data.sort((a, b) => a.position - b.position);
      });
    }

    return this.appList;
  }
}