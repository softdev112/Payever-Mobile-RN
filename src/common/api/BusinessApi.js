import type PayeverApi from './index';

export default class BusinessApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  getActivities(slug: string): Promise<ActivityResp> {
    return this.client.get(`/api/rest/v1/business/${slug}/activities`);
  }

  getTodos(slug: string): Promise<ActivityResp> {
    return this.client.get(`/api/rest/v1/business/${slug}/todos`);
  }

  createNewBusiness(business: Business): Promise<ApiResp> {
    return this.client.post('/api/rest/v1/business/create', { business });
  }
}

declare class ActivityResp extends ApiResp {
  data: Array<ActivityItemData>;
}

/* eslint-disable no-unused-vars */
export type ActivityItemData = {
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

type Business = {
  companyName: string;
  legalForm: string;
  businessLogo: string;
  address: {
    country: string;
    zipCode: string;
    city: string;
    street: string;
    phone: string;
    extraPhone?: string;
    fax?: string;
  };
};