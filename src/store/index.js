import type Config from '../config';

import { enableLogging } from 'mobx-logger';

import AuthStore from './AuthStore';
import UserProfilesStore from './UserProfilesStore';

import PayeverApi from '../common/api';

export default class Store {
  auth: AuthStore;
  userProfiles: UserProfilesStore;

  api: PayeverApi;
  config: Config;

  constructor(config: Config) {
    this.auth = new AuthStore(this);
    this.userProfiles = new UserProfilesStore(this);

    // Initialize some helper objects
    this.api = new PayeverApi({ ...config.api, authStore: this.auth });
    this.config = config;

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