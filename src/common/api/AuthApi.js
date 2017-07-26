import type PayeverApi from './index';

export default class AuthApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  async login(username: string, password: string): Promise<AuthResp> {
    return await this.client.fetch('/oauth/v2/token', {
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

  loginWithTemporarySocialUser(
    clientId: string,
    clientSecret: string
  ): Promise<AuthResp> {
    return this.client.fetch('/oauth/v2/token', {
      query: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'http://www.payever.de/rest',
      },
      preventTokenRefresh: true,
    });
  }

  registerNewUser(user): Promise<ApiResp> {
    return this.client.post(
      '/api/rest/v1/user/register',
      { register_user: user },
      { addTokenToHeader: false }
    );
  }

  resetPassword(email): Promise<ApiResp> {
    return this.client.post(
      '/api/rest/v1/user/resetting/send-email',
      { email },
      { addTokenToHeader: false }
    );
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

  async connectToSocial(socialNetworkName: string, credentials) {
    return await this.client.post(
      `/api/rest/v1/connect/${socialNetworkName}`,
      credentials, {
        format: 'json',
        addTokenToHeader: false,
      });
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