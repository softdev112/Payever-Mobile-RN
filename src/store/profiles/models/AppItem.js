import type BusinessProfile from './BusinessProfile';
import type Store from '../../index';

const SETTINGS = {
  dashboard: {
    screenId: 'dashboard.Dashboard',
  },
  communication: {
    screenId: 'communication.Contacts',
    screenIdTablet: 'communication.Chat',
  },
  settings: {
    webView: {
      referer: '/business/{slug}/home#home',
    },
  },
};

export default class AppItem {
  profile: BusinessProfile;
  store: Store;

  /**
   * Local-overridden app settings
   */
  settings: Settings;

  hasUnreadMessages: ?boolean;
  id: number;
  image: string | Object;
  image_mac: ?string;
  image_mobile: ?string;
  image_tablet: ?string;
  is_configured: ?boolean;
  label: string;
  location: 'top' | 'bottom';
  name: string;
  position: number;
  url: string;

  constructor(data, store: Store, profile: BusinessProfile) {
    this.store = store;
    this.profile = profile;
    Object.assign(this, data);
    this.settings = this.makeSettings();
  }

  get logoSource() {
    if (typeof this.image === 'string') {
      return { uri: this.image };
    }

    return this.image;
  }

  makeSettings() {
    if (!SETTINGS[this.label]) {
      return { webView: {} };
    }

    const settings = Object.assign({ webView: {} }, SETTINGS[this.label]);

    if (settings.webView.referer) {
      settings.webView.referer = this.store.config.siteUrl +
        settings.webView.referer.replace('{slug}', this.profile.business.slug);
    }

    return settings;
  }
}

type Settings = {
  webView: {
    enableExternalBrowser?: boolean;
    referer?: boolean;
  };
  screenId?: string;
};