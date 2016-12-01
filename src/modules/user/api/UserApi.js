import type PayeverApi, { PayeverResponse } from '../../../common/PayeverApi';

export default class UserApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  getBusinesses(): PayeverResponse {

    return this.client.get('/api/rest/v1/user/businesses');
  }
}