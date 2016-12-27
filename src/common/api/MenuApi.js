import type PayeverApi from './index';

export default class MenuApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  getList(profileId, current = 'home'): Promise<MenuResponse> {
    return this.client.get(`/api/rest/v1/menu/list/${profileId}`, { current });
  }
}

type MenuItemData = {
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
};

type MenuResponse = {
  data: Array<MenuItemData>;
  ok: boolean;
};