import type Store from '../index';

export default class AppItem {
  store: Store;

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

  constructor(data, store: Store) {
    this.store = store;
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
    return this.url;
  }

  get plainDescription() {
    return this.description.replace(/<\/?[^>]+(>|$)/g, '');
  }
}