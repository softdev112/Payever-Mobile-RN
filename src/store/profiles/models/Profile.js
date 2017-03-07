import { computed, observable } from 'mobx';

import type Store from '../index';

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

  @computed get isBusiness() {
    return this.type === 'business';
  }

  get logoSource() {
    throw new Error('Abstract getter');
  }

  get displayName() {
    throw new Error('Abstract getter');
  }

  getCommunicationUrl() {
    if (this.isBusiness) {
      //noinspection JSUnresolvedVariable
      const app = this.applications.find(a => a.label === 'communication');
      return app ? app.url : null;
    }

    return '/private/network/app/communication';
  }
}