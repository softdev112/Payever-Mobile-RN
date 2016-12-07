import type PayeverApi from './index';

export default class BusinessApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  getDashboard(slug: string): Promise<DashboardAppItemsResponse> {
    return this.client.get(`/api/rest/v1/business/${slug}/dashboard`);
  }
}

type DashboardAppItem = {
  configured: ?boolean,
  label: string,
  http_url: string,
  name: string,
  route: ?string,
  image: ?string,
  type: 'channel' | 'application',
};

type DashboardAppItemsResponse = {
  data: {
    dashboard: Array<DashboardAppItem>
  },
  ok: boolean
};