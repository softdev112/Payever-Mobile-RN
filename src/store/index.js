/* eslint no-unused-vars: 0 */

import { enableLogging } from 'mobx-logger';

import type { Config } from '../config';
import AuthStore from './AuthStore';
import UserProfilesStore from './UserProfilesStore';
import CommunicationStore from './CommunicationStore';

import PayeverApi from '../common/api';
import SearchStore from './SearchStore';

export default class Store {
  auth: AuthStore;
  userProfiles: UserProfilesStore;

  api: PayeverApi;
  config: Config;
  search: SearchStore;
  comminucation: CommunicationStore;

  constructor(config: Config) {
    this.auth = new AuthStore(this);
    this.userProfiles = new UserProfilesStore(this);
    this.search = new SearchStore(this);
    this.communication = new CommunicationStore(this);

    // Initialize some helper objects
    this.api = new PayeverApi({ ...config.api, authStore: this.auth });
    this.config = config;

    if (__DEV__) {
      // If chrome is not attached
      if (!console.groupCollapsed) {
        console.groupCollapsed = console.log;
        console.groupEnd = () => {};
      }
      // enableLogging();
    }
  }
}