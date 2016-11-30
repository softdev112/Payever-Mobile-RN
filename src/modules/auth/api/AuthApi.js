import type PayeverApi from '../../../common/PayeverApi';

export default class AuthApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  login(username: string, password: string): Promise<Response> {
    return this.client.get('/oauth/v2/token', {
      username,
      password,
      client_id: this.client.clientId,
      client_secret: this.client.clientSecret,
      grant_type: 'password'
    });
  }
}