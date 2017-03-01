import { enableLogging } from 'mobx-logger';

import AuthStore from './AuthStore';
import CommunicationStore from './CommunicationStore';
import OffersStore from './OffersStore';
import SearchStore from './SearchStore';
import UserProfilesStore from './UserProfilesStore';

import PayeverApi from '../common/api';
import type { Config } from '../config';
import { log } from '../common/utils';


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

    if (config.debug.logMobx) {
      // If chrome is not attached we should set a group polyfill
      if (!console.groupCollapsed) {
        console.groupCollapsed = log.info;
        console.groupEnd = () => {};
      }
      enableLogging();
    }
  }
}