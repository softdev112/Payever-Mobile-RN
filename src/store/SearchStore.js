import { action, computed, observable, runInAction } from 'mobx';
import { apiHelper } from 'utils';

import type Store from './index';
//noinspection JSUnresolvedVariable
import imgNoBusiness from './UserProfilesStore/images/no-business.png';

export default class SearchStore {
  @observable items: Array<SearchRow> = [];
  @observable isSearching = false;

  @observable error: string = '';

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  async search(query) {
    const { api } = this.store;

    this.isSearching = true;

    apiHelper(api.profiles.search(query), this)
      .success((data) => {
        if (data.length > 0) {
          this.items = data.map(d => new SearchRow(d));
        } else {
          this.error = 'Sorry, we didn\'t find any results, try ' +
            'searching again';
          this.items = [];
        }
      })
      .complete(() => this.isSearching = false);
  }

  @action
  async follow(businessId) {
    const { api } = this.store;

    // find row element
    const item: SearchRow = this.items.find((row) => row.id === businessId);

    if (!item) {
      runInAction(() => this.error = 'Sorry, internal error occurred.');
      return;
    }

    // Set follow/unfollow processing flag for row
    runInAction(() => item.is_followUpdating = true);

    apiHelper(api.profiles.follow(businessId), this)
      .success(() => {
        item.is_following = true;
      })
      .complete(() => item.is_followUpdating = false);
  }

  @action
  async unfollow(businessId) {
    const { api } = this.store;

    // find row element
    const item: SearchRow = this.items.find((row) => row.id === businessId);

    if (!item) {
      runInAction(() => this.error = 'Sorry, internal error occurred.');
      return;
    }

    // Set follow/unfollow processing flag for row
    runInAction(() => item.is_followUpdating = true);

    apiHelper(api.profiles.unfollow(businessId), this)
      .success(() => {
        item.is_following = false;
      })
      .complete(() => item.is_followUpdating = false);
  }
}

export class SearchRow {
  id: number;
  followers: number;
  following: number;
  customers: number;
  sells: number;
  likes: number;
  offers: number;
  name: string;
  type: string;
  business: {
    name: string;
    currency: string;
    slug: string;
    logo: ?string;
  };
  @observable is_following: boolean;
  @observable is_followUpdating: boolean;

  constructor(data) {
    Object.assign(this, data);
  }

  @computed get logoSource() {
    if (this.business.logo) {
      return { uri: this.business.logo };
    }

    return imgNoBusiness;
  }
}