import { action, computed, observable, runInAction, autorun } from 'mobx';

import type Store from './index';
import imgNoBusiness from './UserProfilesStore/images/no-business.png';

export default class SearchStore {
  @observable items: Array<SearchRow> = [];
  @observable error: string;
  @observable isSearching = false;

  store: Store;

  constructor(store: Store) {
    this.store = store;
    autorun(() => console.log('autorun' + this.isFollowUnfollowUpdating));
  }

  @computed get isFollowUpdating() {
    return !!this.items.find(item => item.is_followUpdating);
  }

  @action
  async search(query) {
    const { api } = this.store;

    runInAction(() => this.isSearching = true);

    try {
      const resp = await api.profiles.search(query);
      runInAction('Update auth state', () => {
        if (!resp.ok) {
          this.error = 'Sorry, internal error occurred. Info: ' +
            resp.data.error_description;
          return;
        }

        if (!resp.data.length) {
          this.error = 'Sorry, we didn\'t find any results, try ' +
            'searching again';
          return;
        }

        this.items = resp.data.map(data => new SearchRow(data));
        this.error = null;
      });
    } catch (e) {
      runInAction(() => this.error = e.message);
    } finally {
      runInAction(() => this.isSearching = false);
    }
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

    try {
      const resp = await api.profiles.follow(businessId);

      runInAction('Follow business', () => {
        if (!resp.ok) {
          this.error = 'Sorry, internal error occurred. Info: ' +
            resp.data.error_description;
          return;
        }

        // Update this profile in state to avoid extra requests
        item.is_following = true;
        this.error = '';
      });
    } catch (e) {
      runInAction(() => this.error = e.message);
    } finally {
      runInAction(() => item.is_followUpdating = false);
    }
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

    try {
      const resp = await api.profiles.unfollow(businessId);

      runInAction('Unfollow business', () => {
        if (!resp.ok) {
          this.error = 'Sorry, internal error occurred. Info: ' +
            resp.data.error_description;
          return;
        }

        // Update this profile in state to avoid extra requests
        item.is_following = false;
        this.error = '';
      });
    } catch (e) {
      runInAction(() => this.error = e.message);
    } finally {
      runInAction(() => item.is_followUpdating = false);
    }
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
    logo: ?string
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