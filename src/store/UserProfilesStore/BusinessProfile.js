//noinspection JSUnresolvedVariable
import {
  computed, observable, extendObservable, runInAction, ObservableArray,
} from 'mobx';
import Profile from './Profile';
import Business from './Business';
import AppItem from './AppItem';
import ActivityItem from './ActivityItem';

//noinspection JSUnresolvedVariable
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
    }
    return imgNoBusiness;
  }

  @computed get displayName() {
    return this.business.company_name || this.business.name;
  }

  async getApplications(): Promise<ObservableArray<AppItem>> {
    if (this.appList.length) {
      return this.appList;
    }

    const resp = await this.store.api.menu.getList(this.id);
    if (resp.ok) {
      runInAction('Set application to the profile', () => {
        this.appList = resp.data
          .sort((a, b) => a.position - b.position)
          .map(item => new AppItem(item));
      });
    }

    return this.appList;
  }

  async getActivities(): Promise<ObservableArray<ActivityItem>> {
    if (this.activityList.length) {
      return this.activityList;
    }

    const resp = await this.store.api.business
      .getActivities(this.business.slug);
    if (resp.ok) {
      runInAction('Set activities to the profile', () => {
        this.activityList = resp.data
          .sort((a, b) => a.priority - b.priority)
          .map(item => new ActivityItem(item, this.store, this));
      });
    }

    return this.activityList;
  }

  async getTodos(): Promise<ObservableArray<ActivityItem>> {
    if (this.todoList.length) {
      return this.todoList;
    }

    const resp = await this.store.api.business.getTodos(this.business.slug);

    if (resp.ok) {
      runInAction('Set activities to the profile', () => {
        this.todoList = resp.data
          .sort((a, b) => a.priority - b.priority)
          .filter(item => item.type !== 'todo_business_mobile_app')
          .map(item => new ActivityItem(item, this.store, this));
      });
    }

    return this.todoList;
  }
}