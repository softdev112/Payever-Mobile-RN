import type PayeverApi from './index';

export default class MarketingApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  getOfferById(id: string): Promise<OfferResp> {
    return this.client.get(`/api/rest/v1/marketing/offer/${id}`);
  }

  getOfferPreviewById(id: string): Promise<OfferResp> {
    return this.client.get(`/api/rest/v1/marketing/offer/${id}/preview`);
  }
}

type OfferResp = any;