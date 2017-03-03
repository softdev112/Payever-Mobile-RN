import type BusinessProfile from './BusinessProfile';
import type Store from '../../index';

const URL_MAP = {
  activity_advertising_offer:
    '/business/{slug}/ad-app',
  activity_invite_team_to_communication_app:
    '/business/{slug}/contacts-app#contacts-app/import',
  activity_import_customers:
    '/business/{slug}/contacts-app#contacts-app/import',
  todo_business_fill_address:
    '/private/network/{id}/account',
  todo_business_add_products:
    '/business/{slug}/items#items-app/import',
};

export default class AppItem {
  store: Store;
  profile: BusinessProfile;

  active: boolean;
  channel: ?string;
  description: string;
  iconImage: ?string;
  id: number;
  image: string;
  priority: number;
  title: string;
  type: string;
  url: string;
  url_label: string;

  constructor(data, store: Store, profile: BusinessProfile) {
    this.store = store;
    this.profile = profile;
    Object.assign(this, data);
  }

  get imageSource() {
    return {
      uri: this.image,
    };
  }

  get iconSource() {
    return {
      uri: this.store.config.siteUrl + this.iconImage,
    };
  }

  get activityUrl() {
    if (URL_MAP[this.type]) {
      return this.store.config.siteUrl + URL_MAP[this.type]
        .replace('{slug}', this.profile.business.slug)
        .replace('{id}', this.profile.id);
    }
    return this.store.config.siteUrl + this.url;
  }

  get plainDescription() {
    return this.description.replace(/<\/?[^>]+(>|$)/g, '');
  }
}