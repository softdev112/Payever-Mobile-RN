import { observable, action } from 'mobx';
import { apiHelper } from 'utils';

import type Store from './index';
import Profile from './Profile';
import BusinessProfile from './BusinessProfile';
import PersonalProfile from './PersonalProfile';

export default class UserProfilesStore {
  @observable ownBusinesses: Array<BusinessProfile>   = [];
  @observable staffBusinesses: Array<BusinessProfile> = [];
  @observable privateProfile: PersonalProfile         = null;

  @observable currentProfile: PersonalProfile | BusinessProfile = null;

  @observable error: string     = '';
  @observable isLoading: string = false;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  toArray(includePrivate = true) {
    let result = [];
    if (includePrivate && this.privateProfile) {
      result.push(this.privateProfile);
    }

    if (this.ownBusinesses.length) {
      result = result.concat(this.ownBusinesses.slice());
    }
    if (this.staffBusinesses.length) {
      result = result.concat(this.staffBusinesses.slice());
    }

    return result;
  }

  @action
  async load(): Promise<LoadProfilesResult> {
    const { api } = this.store;

    //noinspection ES6ModulesDependencies
    return apiHelper(api.profiles.getAccessibleList(), this)
      .success((resp: ApiResp) => {
        const data = resp.data;
        this.ownBusinesses = data.businesses_own.map((profile) => {
          return new BusinessProfile(profile, this.store);
        });
        this.staffBusinesses = data.businesses_staff.map((profile) => {
          return new BusinessProfile(profile, this.store);
        });
        this.privateProfile = new PersonalProfile(data.private, this.store);
      })
      .promise();
  }

  @action
  setCurrentProfile(profile: Profile) {
    this.currentProfile = profile;
  }
}

type LoadProfilesResult = {
  success: boolean;
  error: string;
};