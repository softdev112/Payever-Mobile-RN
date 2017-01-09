import type PayeverApi from './index';

export default class DashboardApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }
}