import type PayeverApi, { PayeverResponse } from './index';

export default class UserApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  getBusinesses(): Promise<PayeverResponse> {
    return this.client.get('/api/rest/v1/profiles/accessible-list');
  }
}