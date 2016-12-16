import type PayeverApi from './index';

export default class BusinessApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  getActivities(slug: string): Promise<ActivityItemResponse> {
    return this.client.get(`/api/rest/v1/business/${slug}/activities`);
  }

  getTodos(slug: string): Promise<ActivityItemResponse> {
    return this.client.get(`/api/rest/v1/business/${slug}/todos`);
  }
}

type ActivityItemData = {
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
};

type ActivityItemResponse = {
  data: Array<ActivityItemData>,
  ok: boolean
};