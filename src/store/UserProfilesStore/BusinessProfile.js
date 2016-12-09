import { observable, extendObservable, runInAction } from 'mobx';
import Profile from './Profile';
import Business from './Business';
import AppItem from './AppItem';

export default class BusinessProfile extends Profile {
  @observable business: Business;

  constructor(data, store) {
    super();
    this.store = store;
    if (data.business) {
      data.business = new Business(data.business, store);
    }
    extendObservable(this, data);
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