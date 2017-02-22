import type PayeverApi from './index';

export default class AuthApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  async login(username: string, password: string): Promise<AuthResp> {
    return this.client.fetch('/oauth/v2/token', {
      query: {
        username,
        password,
        client_id:     this.client.clientId,
        client_secret: this.client.clientSecret,
        grant_type:    'password',
      },
      preventTokenRefresh: true,
    });
  }

  async refreshToken(refreshToken): Promise<AuthResp> {
    return await this.client.fetch('/oauth/v2/token', {
      query: {
        client_id:     this.client.clientId,
        client_secret: this.client.clientSecret,
        grant_type:    'refresh_token',
        refresh_token: refreshToken,
      },
    });
  }

  async logout() {
    try {
      // Now there is only web version.
      await this.client.fetch('/logout');
    } catch (e) {
      return true;
    }
    return true;
  }
}

declare class AuthResp extends ApiResp {
  data: AuthData;
}

export type AuthData = {
  access_token: string;
  expires_in: string;
  refresh_token: string;
};