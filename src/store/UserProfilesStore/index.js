import type Store from './index';

import { observable, action, runInAction } from 'mobx';
import { AsyncStorage } from 'react-native';

import Profile from './Profile';
import BusinessProfile from './BusinessProfile';
import PersonalProfile from './PersonalProfile';

const STORE_NAME = 'store.user-profile';

export default class UserProfilesStore {
  @observable ownBusinesses: Array<BusinessProfile> = [];
  @observable staffBusinesses: Array<BusinessProfile> = [];
  @observable privateProfile: PersonalProfile = null;

  @observable currentProfile: Profile = null;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  setCurrentProfile(profile: Profile) {
    this.currentProfile = profile;
  }

  toArray(includePrivate = true) {
    let result = [];
    if (includePrivate && this.privateProfile) {
      result.push(this.privateProfile);
    }

    if (this.ownBusinesses.length) {
      result = result.concat(this.ownBusinesses.slice())
    }
    if (this.staffBusinesses.length) {
      result = result.concat(this.staffBusinesses.slice())
    }

    return result;
  }

  @action
  async load(): Promise<LoadProfilesResult> {
    const { api } = this.store;

    let data = {};
    try {
      const resp = await api.profiles.getAccessibleList();
      data = resp.data;

      if (!resp.ok) {
        return { success: false, error: data.error_description };
      }
    } catch (e) {
      console.warn(e);
      return { success: false, error: 'Internal error. Please try later.'}
    }

    runInAction('Update profiles list', () => {
      this.ownBusinesses = data.businesses_own.map((profile) => {
        return new BusinessProfile(profile, this.store);
      });
      this.staffBusinesses = data.businesses_staff.map((profile) => {
        return new BusinessProfile(profile, this.store);
      });
      this.privateProfile = new PersonalProfile(data.private, this.store);
    });

    //noinspection JSIgnoredPromiseFromCall
    this.serialize();

    return { success: true };
  }

  serialize(): Promise {
    /*
    return AsyncStorage.setItem(STORE_NAME, JSON.stringify({
        isLoggedIn: this.isLoggedIn,
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresIn: this.expiresIn
      }))
      .catch(e => console.error(e));
     */
  }

  deserialize(): Promise<AuthStore> {
    /*
    return AsyncStorage.getItem(STORE_NAME)
      .then(action((json) => {
        if (!json) return this;
        const data = JSON.parse(json);
        this.isLoggedIn = data.isLoggedIn;
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.expiresIn = data.expiresIn;
        return this;
      }))
      .catch(e => console.error(e));
    */
  }
}

type LoadProfilesResult = {
  success: boolean,
  error: string
}