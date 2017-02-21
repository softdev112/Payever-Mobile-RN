/* eslint no-unused-vars: 0 */
//noinspection ES6UnusedImports
import { enableLogging } from 'mobx-logger';

import AuthStore from './AuthStore';
import CommunicationStore from './CommunicationStore';
import OffersStore from './OffersStore';
import SearchStore from './SearchStore';
import UserProfilesStore from './UserProfilesStore';

import PayeverApi from '../common/api';
import type { Config } from '../config';


export default class Store {
  auth: AuthStore;
  communication: CommunicationStore;
  offers: OffersStore;
  search: SearchStore;
  userProfiles: UserProfilesStore;

  api: PayeverApi;
  config: Config;

  constructor(config: Config) {
    this.auth          = new AuthStore(this);
    this.communication = new CommunicationStore(this);
    this.offers        = new OffersStore(this);
    this.search        = new SearchStore(this);
    this.userProfiles  = new UserProfilesStore(this);

    // Initialize some helper objects
    this.api = new PayeverApi(config, this.auth);
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