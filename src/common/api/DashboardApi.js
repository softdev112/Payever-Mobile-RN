import type PayeverApi from './index';

export default class DashboardApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }
}
