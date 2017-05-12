import { enableLogging } from 'mobx-logger';
import { log } from 'utils';

import PayeverApi from '../common/api';
import type { Config } from '../config';

import AuthStore from './auth';
import CommunicationStore from './communication';
import OffersStore from './offers';
import ProfilesStore from './profiles';
import SearchStore from './search';
import UIStore from './ui';

/* eslint-disable no-console */
export default class Store {
  auth: AuthStore                   = new AuthStore(this);
  communication: CommunicationStore = new CommunicationStore(this);
  offers: OffersStore               = new OffersStore(this);
  profiles: ProfilesStore           = new ProfilesStore(this);
  search: SearchStore               = new SearchStore(this);
  ui: UIStore                       = new UIStore(this);

  api: PayeverApi;
  config: Config;

  constructor(config: Config) {
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