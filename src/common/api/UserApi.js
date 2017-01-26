import type PayeverApi from './index';

export default class UserApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }
}