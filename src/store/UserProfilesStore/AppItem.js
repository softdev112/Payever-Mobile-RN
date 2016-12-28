export default class AppItem {
  hasUnreadMessages: ?boolean;
  id: number;
  image: string;
  image_mac: ?string;
  image_mobile: ?string;
  image_tablet: ?string;
  is_configured: ?boolean;
  label: string;
  location: 'top' | 'bottom';
  name: string;
  position: number;
  url: string;

  constructor(data) {
    Object.assign(this, data);
  }

  get logoSource() {
    if (typeof this.image === 'string') {
      return { uri: this.image };
    }
    return this.image;
  }
}