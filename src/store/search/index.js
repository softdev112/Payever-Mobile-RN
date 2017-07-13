import { action, computed, observable, extendObservable } from 'mobx';
import { apiHelper } from 'utils';
import { images } from 'ui';

import type { SearchDataRow } from '../../common/api/ProfilesApi';
import type Store from './../index';

export default class SearchStore {
  @observable items: Array<SearchRow> = [];
  @observable isSearching = false;

  @observable error: string = '';
  @observable isLoading: boolean = false;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  async search(query) {
    const { profiles } = this.store.api;

    this.isSearching = true;

    return apiHelper(profiles.search.bind(profiles, query), this)
      .success((data: Array<SearchDataRow>) => {
        if (data.length > 0) {
          this.items = data.map(d => new SearchRow(d));
        } else {
          this.error = 'Sorry, we didn\'t find any results, try ' +
            'searching again';
          this.items = [];
        }
      })
      .complete(() => this.isSearching = false)
      .promise();
  }

  @action
  follow(businessId) {
    const { profiles } = this.store.api;

    const item = this.items.find(i => i.id === businessId);
    if (!item) return;

    item.is_followUpdating = true;
    apiHelper(profiles.follow.bind(profiles, businessId), this)
      .success(() => item.is_following = true)
      .complete(() => item.is_followUpdating = false);
  }

  @action
  unfollow(businessId) {
    const { profiles } = this.store.api;

    const item = this.items.find(i => i.id === businessId);
    if (!item) return;

    item.is_followUpdating = true;
    apiHelper(profiles.unfollow.bind(profiles, businessId), this)
      .success(() => item.is_following = false)
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
  is_following: boolean;
  is_followUpdating: boolean;

  constructor(data) {
    extendObservable(this, {
      ...data,
      is_followUpdating: false,
    });
  }

  @computed get logoSource() {
    if (this.business.logo) {
      return { uri: this.business.logo };
    }

    return images.noBusiness;
  }
}