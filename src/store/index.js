import { enableLogging } from 'mobx-logger';

import AuthStore from './AuthStore';
import UserProfilesStore from './UserProfilesStore';

import PayeverApi from '../common/api';

export default class Store {
  auth: AuthStore;
  userProfiles: UserProfilesStore;

  api: PayeverApi;

  constructor(config) {
    this.auth = new AuthStore(this);
    this.userProfiles = new UserProfilesStore(this);

    // Initialize some helper classes
    this.api = new PayeverApi({ ...config.api, authStore: this.auth });

    if (__DEV__) {
      // If chrome is not attached
      if (!console.groupCollapsed) {
        console.groupCollapsed = console.log;
        console.groupEnd = ()=>{};
      }
      enableLogging();
    }
  }
}